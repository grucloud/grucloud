const assert = require("assert");
const { pipe, tap, get, flatMap, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  pick(["ResourceId", "ScalableDimension", "ServiceNamespace"]),
  tap(({ ServiceNamespace, ResourceId, ScalableDimension }) => {
    assert(ServiceNamespace);
    assert(ResourceId);
    assert(ScalableDimension);
  }),
]);

const findName = pipe([
  get("live"),
  ({ ResourceId, ScalableDimension }) => `${ResourceId}::${ScalableDimension}`,
]);

const model = ({ config }) => ({
  package: "application-auto-scaling",
  client: "ApplicationAutoScaling",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalableTargets-property
  getById: {
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ ServiceNamespace, ResourceId }) => ({
        ServiceNamespace,
        ResourceIds: [ResourceId],
      }),
    ]),
    method: "describeScalableTargets",
    getField: "ScalableTargets",
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#registerScalableTarget-property
  create: {
    method: "registerScalableTarget",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "registerScalableTarget",
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#deregisterScalableTarget-property
  destroy: {
    method: "deregisterScalableTarget",
    pickId,
  },
});

exports.ApplicationAutoScalingTarget = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName,
    findId: findName,
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalableTargets-property
    getList: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        //TODO
        () => [
          "appstream",
          "dynamodb",
          "ecs",
          "ec2",
          "elasticache",
          "elasticmapreduce",
          "kafka",
          "lambda",
          "neptune",
          "rds",
          //"sagemaker",
          //"custom-resource",
          //"comprehend",
          //"cassandra",
        ],
        flatMap(
          pipe([
            (ServiceNamespace) => ({ ServiceNamespace }),
            endpoint().describeScalableTargets,
            get("ScalableTargets"),
          ])
        ),
      ]),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {},
    }) => pipe([() => otherProps, defaultsDeep({})])(),
  });
