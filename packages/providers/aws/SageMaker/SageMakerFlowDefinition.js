const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("FlowDefinitionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ FlowDefinitionName }) => {
    assert(FlowDefinitionName);
  }),
  pick(["FlowDefinitionName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerFlowDefinition = () => ({
  type: "FlowDefinition",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "FlowDefinitionArn",
    "CreationTime",
    "LastModifiedTime",
    "KmsKeyId",
    "FlowDefinitionStatus",
    "RoleArn",
    "HumanLoopConfig.HumanTaskUiArn",
    "HumanLoopConfig.WorkteamArn",
  ],
  inferName: () =>
    pipe([
      get("FlowDefinitionName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("FlowDefinitionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("FlowDefinitionName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RoleArn"),
          tap((RoleArn) => {
            assert(RoleArn);
          }),
        ]),
    },
    humanTaskUi: {
      type: "HumanTaskUi",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("HumanLoopConfig.HumanTaskUiArn"),
          tap((HumanTaskUiArn) => {
            assert(HumanTaskUiArn);
          }),
        ]),
    },
    workteam: {
      type: "WorkTeam",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("HumanLoopConfig.WorkteamArn"),
          tap((WorkteamArn) => {
            assert(WorkteamArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeFlowDefinition-property
  getById: {
    method: "describeFlowDefinition",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listFlowDefinitions-property
  getList: {
    method: "listFlowDefinitions",
    getParam: "FlowDefinitionSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createFlowDefinition-property
  create: {
    method: "createFlowDefinition",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("FlowDefinitionStatus"), isIn(["Active"])]),
    isInstanceError: pipe([get("FlowDefinitionStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateFlowDefinition-property
  update: {
    method: "updateFlowDefinition",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteFlowDefinition-property
  destroy: {
    method: "deleteFlowDefinition",
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
    dependencies: { iamRole, humanTaskUi, workteam },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
        assert(humanTaskUi);
        assert(workteam);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        RoleArn: getField(iamRole, "Arn"),
        HumanLoopConfig: {
          HumanTaskUiArn: getField(humanTaskUi, "HumanTaskUiArn"),
          WorkteamArn: getField(workteam, "WorkteamArn"),
        },
      }),
    ])(),
});
