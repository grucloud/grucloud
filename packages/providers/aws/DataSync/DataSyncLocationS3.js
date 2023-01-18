const assert = require("assert");
const { pipe, tap, get, pick, map, eq } = require("rubico");
const { defaultsDeep, when, identity, find, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  findS3FromLocationUri,
  assignTags,
} = require("./DataSyncCommon");

const buildArn = () =>
  pipe([
    get("LocationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ LocationArn }) => {
    assert(LocationArn);
  }),
  pick(["LocationArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html
exports.DataSyncLocationS3 = () => ({
  type: "LocationS3",
  package: "datasync",
  client: "DataSync",
  propertiesDefault: {},
  omitProperties: [
    "LocationArn",
    "LocationUri",
    "S3BucketArn",
    "S3Config",
    "CreationTime",
    "AgentArns",
  ],
  inferName: ({ dependenciesSpec: { s3Bucket } }) =>
    pipe([
      tap((params) => {
        assert(s3Bucket);
      }),
      () => `${s3Bucket}`,
    ]),
  findName: ({ lives, config }) =>
    pipe([
      findS3FromLocationUri({ lives, config }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("LocationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidRequestException"],
  dependencies: {
    agents: {
      type: "Agent",
      group: "DataSync",
      list: true,
      dependencyIds: () => pipe([get("AgentArns")]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: () => pipe([get("S3Config.BucketAccessRoleArn")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          findS3FromLocationUri({ lives, config }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#describeLocationS3-property
  getById: {
    method: "describeLocationS3",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#listLocations-property
  getList: {
    enhanceParams: () =>
      pipe([
        () => ({
          Filters: [
            { Name: "LocationType", Operator: "Equals", Values: ["S3"] },
          ],
        }),
      ]),
    method: "listLocations",
    getParam: "Locations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#createLocationS3-property
  create: {
    method: "createLocationS3",
    pickCreated: ({ payload }) => pipe([identity]),
    shouldRetryOnExceptionMessages: ["Unable to assume role"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#updateLocationS3-property
  update: {
    method: "updateLocationS3",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#deleteLocationS3-property
  destroy: {
    method: "deleteLocation",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { agents, s3Bucket, iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(s3Bucket);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        S3BucketArn: getField(s3Bucket, "Arn"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        S3Config: { BucketAccessRoleArn: getField(iamRole, "Arn") },
      }),
      when(
        () => agents,
        defaultsDeep({
          AgentArns: pipe([
            () => agents,
            // TODO
            map((agent) => getField(agent, "Arn")),
          ])(),
        })
      ),
    ])(),
});
