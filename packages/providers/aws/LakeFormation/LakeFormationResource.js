const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, callProp, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const pickId = pipe([
  tap(({ ResourceArn }) => {
    assert(ResourceArn);
  }),
  pick(["ResourceArn"]),
]);

const decorate = ({ endpoint, live, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    defaultsDeep(live),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html
exports.LakeFormationResource = () => ({
  type: "Resource",
  package: "lakeformation",
  client: "LakeFormation",
  propertiesDefault: {},
  omitProperties: ["ResourceArn", "LastModified"],
  inferName: ({ dependenciesSpec: { s3Bucket } }) =>
    pipe([
      tap((s3Bucket) => {
        assert(s3Bucket);
      }),
      () => s3Bucket,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("ResourceArn"),
        tap((id) => {
          assert(id);
        }),
        callProp("replace", "arn:aws:s3:::", ""),
        lives.getById({
          type: "Bucket",
          group: "S3",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("ResourceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  //   compare: compare({
  //     filterTarget: () => pipe([omit(["compare"])]),
  //   }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        RoleArn: pipe([
          get("RoleArn"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResourceArn"),
          callProp("replace", "arn:aws:s3:::", ""),
          lives.getById({
            type: "Bucket",
            group: "S3",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
    },
  },
  ignoreErrorCodes: ["EntityNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#describeResource-property
  getById: {
    method: "describeResource",
    getField: "ResourceInfo",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#listResources-property
  getList: {
    method: "listResources",
    getParam: "ResourceInfoList",
    decorate: ({ getById }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#registerResource-property
  create: {
    method: "registerResource",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#deregisterResource-property
  destroy: {
    method: "deregisterResource",
    pickId,
    ignoreErrorMessages: [
      "Must manually delete service-linked role to deregister last S3 location",
    ],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole, s3Bucket },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(s3Bucket);
      }),
      defaultsDeep({
        ResourceArn: `arn:${config.partition}:s3:::${getField(
          s3Bucket,
          "Name"
        )}`,
        RoleArn: getField(iamRole, "Arn"),
      }),
    ])(),
});
