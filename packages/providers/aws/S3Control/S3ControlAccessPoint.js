const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Name, AccountId }) => {
    assert(Name);
    assert(AccountId);
  }),
  pick(["Name", "AccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html
exports.S3ControlAccessPoint = () => ({
  type: "AccessPoint",
  package: "s3-control",
  client: "S3Control",
  propertiesDefault: {},
  omitProperties: [
    "AccountId",
    "CreationDate",
    "AccessPointArn",
    "Endpoints",
    "BucketAccountId",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AccessPointArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchAccessPoint"],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Bucket"),
          tap((Bucketparams) => {
            assert(Bucket);
          }),
        ]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([get("VpcConfiguration.VpcId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#getAccessPoint-property
  getById: {
    method: "getAccessPoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#listAccessPoints-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AccountId: config.accountId() }),
    method: "listAccessPoints",
    getParam: "AccessPointList",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#createAccessPoint-property
  create: {
    method: "createAccessPoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // TODO update ?
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#deleteAccessPoint-property
  destroy: {
    method: "deleteAccessPoint",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => vpc,
        defaultsDeep({
          AccountId: config.accountId(),
          VpcConfiguration: { VpcId: getField(vpc, "VpcId") },
        })
      ),
    ])(),
});
