const assert = require("assert");
const { pipe, tap, get, eq, flatMap, pick, switchCase } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["ResourceId", "ScalableDimension", "ServiceNamespace"]),
  tap(({ ServiceNamespace, ResourceId, ScalableDimension }) => {
    assert(ServiceNamespace);
    assert(ResourceId);
    assert(ScalableDimension);
  }),
]);

const findName = () =>
  pipe([
    tap(({ ResourceId, ScalableDimension }) => {
      assert(ResourceId);
      assert(ScalableDimension);
    }),
    ({ ResourceId, ScalableDimension }) =>
      `${ResourceId}::${ScalableDimension}`,
  ]);

const findDependencyId =
  ({ type, group, ServiceNamespace }) =>
  ({ lives, config }) =>
    pipe([
      switchCase([
        eq(get("ServiceNamespace"), ServiceNamespace),
        pipe([
          get("ResourceId"),
          callProp("split", "/"),
          last,
          lives.getByName({
            type,
            group,
            providerName: config.providerName,
          }),
          get("id"),
        ]),
        () => undefined,
      ]),
    ]);

exports.ApplicationAutoScalingTarget = ({}) => ({
  type: "Target",
  package: "application-auto-scaling",
  client: "ApplicationAutoScaling",
  inferName: findName,
  findName,
  findId: findName,
  propertiesDefault: {},
  omitProperties: [
    "RoleARN",
    "CreationTime",
    "SuspendedState",
    "ScalableTargetARN",
  ],
  dependencies: {
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: () => get("RoleARN"),
    },
    dynamoDbTable: {
      type: "Table",
      group: "DynamoDB",
      dependencyId: findDependencyId({
        type: "Table",
        group: "DynamoDB",
        ServiceNamespace: "dynamodb",
      }),
    },
    ecsService: {
      type: "Service",
      group: "ECS",
      dependencyId: findDependencyId({
        type: "Service",
        group: "ECS",
        ServiceNamespace: "ecs",
      }),
    },
  },
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
  ignoreErrorCodes: ["ObjectNotFoundException"],
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
  //TODO Tags
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
