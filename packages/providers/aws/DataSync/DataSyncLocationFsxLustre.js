const assert = require("assert");
const { pipe, tap, get, pick, map, eq } = require("rubico");
const { defaultsDeep, find, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, findFsxFromLocation } = require("./DataSyncCommon");

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
exports.DataSyncLocationFsxLustre = () => ({
  type: "LocationFsxLustre",
  package: "datasync",
  client: "DataSync",
  propertiesDefault: {},
  omitProperties: [
    "LocationArn",
    "LocationUri",
    "CreationTime",
    "SecurityGroupArns",
    "FsxFilesystemArn",
  ],
  inferName: ({ dependenciesSpec: { fsxFileSystem } }) =>
    pipe([
      tap((params) => {
        assert(fsxFileSystem);
      }),
      () => `${fsxFileSystem}`,
    ]),
  findName: ({ lives, config }) =>
    pipe([
      findFsxFromLocation({ lives, config }),
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
    fsxFileSystem: {
      type: "FileSystem",
      group: "FSx",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          findFsxFromLocation({ lives, config }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("SecurityGroupArns"),
          map((securityGroupArn) =>
            pipe([
              lives.getByType({
                type: "SecurityGroup",
                group: "EC2",
                providerName: config.providerName,
              }),
              find(eq(get("live.Arn"), securityGroupArn)),
            ])()
          ),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#describeLocationFsxLustre-property
  getById: {
    method: "describeLocationFsxLustre",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#listLocations-property
  getList: {
    enhanceParams: () =>
      pipe([
        () => ({
          Filters: [
            { Name: "LocationType", Operator: "Contains", Values: ["Lustre"] },
          ],
        }),
      ]),
    method: "listLocations",
    getParam: "Locations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#createLocationFsxLustre-property
  create: {
    method: "createLocationFsxLustre",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#deleteLocationFsxLustre-property
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
    dependencies: { fsxFileSystem, securityGroups },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(fsxFileSystem);
        assert(securityGroups);
      }),
      () => otherProps,
      defaultsDeep({
        FsxFilesystemArn: getField(fsxFileSystem, "ResourceARN"),
        SecurityGroupArns: pipe([
          () => securityGroups,
          map((sg) => getField(sg, "Arn")),
        ])(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
