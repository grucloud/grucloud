const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ NotebookInstanceLifecycleConfigName }) => {
    assert(NotebookInstanceLifecycleConfigName);
  }),
  pick(["NotebookInstanceLifecycleConfigName"]),
]);

const decodeBase64 = pipe([
  tap(({ Content }) => {
    assert(Content);
  }),
  assign({
    Content: pipe([({ Content }) => Buffer.from(Content, "base64").toString()]),
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({ OnCreate: map(decodeBase64), OnStart: map(decodeBase64) }),
  ]);

const dataToBase64 = assign({
  Content: ({ Content }) => Buffer.from(Content).toString("base64"),
});

const filterPayload = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({ OnCreate: map(dataToBase64), OnStart: map(dataToBase64) }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerNotebookInstanceLifecycleConfig = () => ({
  type: "NotebookInstanceLifecycleConfig",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "NotebookInstanceLifecycleConfigArn",
    "CreationTime",
    "LastModifiedTime",
  ],
  inferName: () =>
    pipe([
      get("NotebookInstanceLifecycleConfigName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("NotebookInstanceLifecycleConfigName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("NotebookInstanceLifecycleConfigArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    codeRepository: {
      type: "CodeRepository",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => get("DefaultCodeRepository"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeNotebookInstanceLifecycleConfig-property
  getById: {
    method: "describeNotebookInstanceLifecycleConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listNotebookInstanceLifecycleConfigs-property
  getList: {
    method: "listNotebookInstanceLifecycleConfigs",
    getParam: "NotebookInstanceLifecycleConfigs",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createNotebookInstanceLifecycleConfig-property
  create: {
    filterPayload,
    method: "createNotebookInstanceLifecycleConfig",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateNotebookInstanceLifecycleConfig-property
  update: {
    method: "updateNotebookInstanceLifecycleConfig",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteNotebookInstanceLifecycleConfig-property
  destroy: {
    method: "deleteNotebookInstanceLifecycleConfig",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps])(),
});
