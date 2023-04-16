const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

// TODO listStorageLensConfigurations is KO: https://github.com/aws/aws-sdk/issues/259

// const {
//   Tagger,
//   //assignTags,
// } = require("./S3ControlCommon");

const toConfigId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id, ...other }) => ({
    ConfigId: Id,
    ...other,
  }),
]);

const buildArn = () =>
  pipe([
    get("StorageLensArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AccountId, ConfigId }) => {
    assert(AccountId);
    assert(ConfigId);
  }),
  pick(["AccountId", "ConfigId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toConfigId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html
exports.S3ControlStorageLensConfiguration = () => ({
  type: "StorageLensConfiguration",
  package: "s3-control",
  client: "S3Control",
  propertiesDefault: {},
  omitProperties: ["AwsOrg", "ConfigId"],
  inferName: () =>
    pipe([
      get("ConfigId"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ConfigId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StorageLensArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#getStorageLensConfiguration-property
  getById: {
    method: "getStorageLensConfiguration",
    getField: "StorageLensConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#listStorageLensConfigurations-property
  getList: {
    enhanceParams: ({ config }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({ AccountId: config.accountId() }),
      ]),
    method: "listStorageLensConfigurations",
    getParam: "StorageLensConfigurationList",
    decorate: ({ getById, config }) =>
      pipe([
        tap((arn) => {
          assert(arn);
        }),
        toConfigId,
        defaultsDeep({ AccountId: config.accountId() }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#putStorageLensConfiguration-property
  create: {
    method: "putStorageLensConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#putStorageLensConfiguration-property
  update: {
    method: "putStorageLensConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#deleteStorageLensConfiguration-property
  destroy: {
    method: "deleteStorageLensConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  //   tagger: ({ config }) =>
  //     Tagger({
  //       buildArn: buildArn({ config }),
  //     }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([() => otherProps, defaultsDeep({ AccountId: config.accountId() })])(),
});
