const assert = require("assert");
const { pipe, tap, get, flatMap, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { ServiceList } = require("./ApplicationAutoScalingCommon");

const pickId = pipe([
  pick(["PolicyName", "ResourceId", "ScalableDimension", "ServiceNamespace"]),
  tap(({ PolicyName, ResourceId, ScalableDimension, ServiceNamespace }) => {
    assert(PolicyName);
    assert(ServiceNamespace);
    assert(ResourceId);
    assert(ScalableDimension);
  }),
]);

exports.ApplicationAutoScalingPolicy = ({}) => ({
  type: "Policy",
  package: "application-auto-scaling",
  client: "ApplicationAutoScaling",
  findName: () =>
    pipe([
      ({ ResourceId, ScalableDimension, PolicyName }) =>
        `${ResourceId}::${ScalableDimension}::${PolicyName}`,
    ]),
  findId: () => pipe([get("PolicyARN")]),
  ignoreErrorCodes: ["ObjectNotFoundException"],
  propertiesDefault: {},
  omitProperties: ["Alarms", "PolicyARN", "CreationTime"],
  inferName: () =>
    pipe([
      ({ ResourceId, ScalableDimension, PolicyName }) =>
        `${ResourceId}::${ScalableDimension}::${PolicyName}`,
    ]),
  dependencies: {
    target: {
      type: "Target",
      group: "ApplicationAutoScaling",
      dependencyId: () =>
        pipe([
          ({ ResourceId, ScalableDimension }) =>
            `${ResourceId}::${ScalableDimension}`,
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalingPolicies-property
  getById: {
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ ServiceNamespace, ScalableDimension, ResourceId, PolicyName }) => ({
        ServiceNamespace,
        ScalableDimension,
        ResourceId,
        PolicyNames: [PolicyName],
      }),
    ]),
    method: "describeScalingPolicies",
    getField: "ScalingPolicies",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#putScalingPolicy-property
  create: {
    method: "putScalingPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "putScalingPolicy",
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#deleteScalingPolicy-property
  destroy: {
    method: "deleteScalingPolicy",
    pickId,
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalingPolicies-property
  getList: ({ endpoint }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      //TODO
      () => ServiceList,
      flatMap(
        pipe([
          (ServiceNamespace) => ({ ServiceNamespace }),
          endpoint().describeScalingPolicies,
          get("ScalingPolicies"),
        ])
      ),
    ]),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
