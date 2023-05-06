const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  flatMap,
  pick,
  switchCase,
  map,
  omit,
} = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const {
  ServiceList,
  Tagger,
  assignTags,
} = require("./ApplicationAutoScalingCommon");

const pickId = pipe([
  pick(["ResourceId", "ScalableDimension", "ServiceNamespace"]),
  tap(({ ServiceNamespace, ResourceId, ScalableDimension }) => {
    assert(ServiceNamespace);
    assert(ResourceId);
    assert(ScalableDimension);
  }),
]);

const buildArn = () =>
  pipe([
    get("ScalableTargetARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ config, endpoint }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
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
          // TODO always getByName ?
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
    rdsCluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: findDependencyId({
        type: "DBCluster",
        group: "RDS",
        ServiceNamespace: "rds",
      }),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalableTargets-property
  getList: ({ endpoint, config }) =>
    pipe([
      //TODO
      () => ServiceList,
      flatMap(
        pipe([
          (ServiceNamespace) => ({ ServiceNamespace }),
          endpoint().describeScalableTargets,
          get("ScalableTargets"),
          map(decorate({ endpoint, config })),
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
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#registerScalableTarget-property
  create: {
    method: "registerScalableTarget",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "Unable to assume IAM role",
      "ECS service doesn't exist",
    ],
  },
  update: {
    method: "registerScalableTarget",
    filterParams: ({ payload }) => pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#deregisterScalableTarget-property
  destroy: {
    method: "deregisterScalableTarget",
    pickId,
  },
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
