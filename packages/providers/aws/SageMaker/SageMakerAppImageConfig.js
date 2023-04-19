const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("AppImageConfigArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AppImageConfigName }) => {
    assert(AppImageConfigName);
  }),
  pick(["AppImageConfigName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerAppImageConfig = () => ({
  type: "AppImageConfig",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: ["AppImageConfigArn", "CreationTime", "LastModifiedTime"],
  inferName: () =>
    pipe([
      get("AppImageConfigName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("AppImageConfigName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AppImageConfigArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeAppImageConfig-property
  getById: {
    method: "describeAppImageConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listAppImageConfigs-property
  getList: {
    method: "listAppImageConfigs",
    getParam: "AppImageConfigs",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createAppImageConfig-property
  create: {
    method: "createAppImageConfig",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateAppImageConfig-property
  update: {
    method: "updateAppImageConfig",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteAppImageConfig-property
  destroy: {
    method: "deleteAppImageConfig",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
