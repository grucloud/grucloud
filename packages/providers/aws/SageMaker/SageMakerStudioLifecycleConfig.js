const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("StudioLifecycleConfigArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ StudioLifecycleConfigName }) => {
    assert(StudioLifecycleConfigName);
  }),
  pick(["StudioLifecycleConfigName"]),
]);

const decodeBase64 = pipe([
  tap(({ StudioLifecycleConfigContent }) => {
    assert(StudioLifecycleConfigContent);
  }),
  assign({
    StudioLifecycleConfigContent: pipe([
      ({ StudioLifecycleConfigContent }) =>
        Buffer.from(StudioLifecycleConfigContent, "base64").toString(),
    ]),
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    decodeBase64,
  ]);

const dataToBase64 = assign({
  StudioLifecycleConfigContent: ({ StudioLifecycleConfigContent }) =>
    Buffer.from(StudioLifecycleConfigContent).toString("base64"),
});

const filterPayload = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    dataToBase64,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerStudioLifecycleConfig = () => ({
  type: "StudioLifecycleConfig",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "StudioLifecycleConfigArn",
    "CreationTime",
    "LastModifiedTime",
  ],
  inferName: () =>
    pipe([
      get("StudioLifecycleConfigName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("StudioLifecycleConfigName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StudioLifecycleConfigArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    codeRepository: {
      type: "CodeRepository",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => get("DefaultCodeRepository"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeStudioLifecycleConfig-property
  getById: {
    method: "describeStudioLifecycleConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listStudioLifecycleConfigs-property
  getList: {
    method: "listStudioLifecycleConfigs",
    getParam: "StudioLifecycleConfigs",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createStudioLifecycleConfig-property
  create: {
    filterPayload,
    method: "createStudioLifecycleConfig",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteStudioLifecycleConfig-property
  destroy: {
    method: "deleteStudioLifecycleConfig",
    pickId,
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  getByName: getByNameCore,
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
