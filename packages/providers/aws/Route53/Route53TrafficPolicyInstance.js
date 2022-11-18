const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53TrafficPolicyInstance = () => ({
  type: "TrafficPolicyInstance",
  package: "route-53",
  client: "Route53",
  propertiesDefault: {},
  omitProperties: ["Id", "HostedZoneId", "State", "Message", "TrafficPolicyId"],
  inferName: ({
    properties: { Name, TrafficPolicyType },
    dependenciesSpec: { hostedZone },
  }) =>
    pipe([
      tap((Name) => {
        assert(hostedZone);
        assert(Name);
        assert(TrafficPolicyType);
      }),
      () => `${hostedZone}::${TrafficPolicyType}::${Name}`,
    ])(),
  findName: ({ live, lives, config }) =>
    pipe([
      tap(() => {
        assert(config);
        assert(live.HostedZoneId);
        assert(live.TrafficPolicyType);
        assert(live.Name);
      }),
      () => live,
      get("HostedZoneId"),
      (id) =>
        lives.getById({
          id,
          type: "HostedZone",
          group: "Route53",
          providerName: config.providerName,
        }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
      append(`::`),
      append(live.TrafficPolicyType),
      append(`::`),
      append(live.Name),
    ])(),
  findId: pipe([
    get("live"),
    get("Id"),
    tap((id) => {
      assert(id);
    }),
  ]),
  ignoreErrorCodes: ["NoSuchTrafficPolicyInstance"],
  dependencies: {
    hostedZone: {
      type: "HostedZone",
      group: "Route53",
      // TODO parent for list only
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("HostedZoneId")]),
    },
    trafficPolicy: {
      type: "TrafficPolicy",
      group: "Route53",
      dependencyId: ({ lives, config }) => pipe([get("TrafficPolicyId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getTrafficPolicyInstance-property
  getById: {
    method: "getTrafficPolicyInstance",
    getField: "TrafficPolicyInstance",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listTrafficPolicies-property
  getList: {
    method: "listTrafficPolicyInstances",
    getParam: "TrafficPolicyInstances",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createTrafficPolicyInstance-property
  create: {
    method: "createTrafficPolicyInstance",
    pickCreated: ({ payload }) => pipe([get("TrafficPolicyInstance")]),
    // State == Applied
    // Failed
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#updateTrafficPolicyInstance-property
  update: {
    method: "updateTrafficPolicyInstance",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        pick(["TTL", "TrafficPolicyId", "TrafficPolicyVersion"]),
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteTrafficPolicyInstance-property
  destroy: {
    method: "deleteTrafficPolicyInstance",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { hostedZone, trafficPolicy },
  }) =>
    pipe([
      tap((params) => {
        assert(trafficPolicy);
        assert(hostedZone);
      }),
      () => otherProps,
      defaultsDeep({
        HostedZoneId: getField(hostedZone, "HostedZoneId"),
        TrafficPolicyId: getField(trafficPolicy, "Id"),
        TrafficPolicyVersion: getField(trafficPolicy, "Version"),
      }),
    ])(),
});
