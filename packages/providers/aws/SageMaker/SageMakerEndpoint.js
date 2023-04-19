const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("EndpointArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ EndpointName }) => {
    assert(EndpointName);
  }),
  pick(["EndpointName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerEndpoint = () => ({
  type: "Endpoint",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "EndpointArn",
    "CreationTime",
    "LastModifiedTime",
    "EndpointStatus",
    "FailureReason",
    "LastDeploymentConfig",
    "DataCaptureConfig",
    "ExplainerConfig",
    "PendingDeploymentSummary",
    "ProductionVariants",
    "ShadowProductionVariants",
  ],
  inferName: () =>
    pipe([
      get("EndpointName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EndpointName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EndpointName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    endpointConfig: {
      type: "EndpointConfig",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => get("EndpointConfigName"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeEndpoint-property
  getById: {
    method: "describeEndpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listEndpoints-property
  getList: {
    method: "listEndpoints",
    getParam: "Endpoints",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createEndpoint-property
  create: {
    method: "createEndpoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("EndpointStatus"), isIn(["InService"])]),
    isInstanceError: pipe([get("EndpointStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateEndpoint-property
  update: {
    method: "updateEndpoint",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteEndpoint-property
  destroy: {
    method: "deleteEndpoint",
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
    dependencies: { endpointConfig },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(endpointConfig);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        EndpointConfigName: endpointConfig.config.EndpointConfigName,
      }),
    ])(),
});
