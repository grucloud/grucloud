const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./TransferCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ WorkflowId }) => {
    assert(WorkflowId);
  }),
  pick(["WorkflowId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html
exports.TransferWorkflow = () => ({
  type: "Workflow",
  package: "transfer",
  client: "Transfer",
  propertiesDefault: {},
  omitProperties: ["WorkflowId", "Arn"],
  inferName: () =>
    pipe([
      get("Description"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Description"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("WorkflowId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  // TODO dependencies:
  // - EFS FileSystem
  // - Lambda Function
  // - S3 Bucket
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#describeWorkflow-property
  getById: {
    method: "describeWorkflow",
    getField: "Workflow",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#listWorkflows-property
  getList: {
    method: "listWorkflows",
    getParam: "Workflows",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#createWorkflow-property
  create: {
    method: "createWorkflow",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#deleteWorkflow-property
  destroy: {
    method: "deleteWorkflow",
    pickId,
    shouldRetryOnExceptionMessages: ["Workflow is still in use by server"],
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
        Tags: buildTags({ name, config, namespace, WorkflowTags: Tags }),
      }),
    ])(),
});
