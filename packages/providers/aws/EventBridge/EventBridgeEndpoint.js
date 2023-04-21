const assert = require("assert");
const { pipe, tap, get, pick, map, eq } = require("rubico");
const { defaultsDeep, pluck, when, identity, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html
exports.EventBridgeEndpoint = () => ({
  type: "Endpoint",
  package: "eventbridge",
  client: "EventBridge",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "EventBuses",
    "RoleArn",
    "EndpointId",
    "EndpointUrl",
    "State",
    "StateReason",
    "CreationTime",
    "LastModifiedTime",
    "RoutingConfig.FailoverConfig.Primary.HealthCheck",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    eventBuses: {
      type: "EventBus",
      group: "CloudWatchEvents",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("EventBuses"), pluck("EventBusArn")]),
    },
    route53HealthCheck: {
      type: "HealthCheck",
      group: "Route53",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RoutingConfig.FailoverConfig.Primary.HealthCheck"),
          (HealthCheck) =>
            pipe([
              lives.getByType({
                providerName: config.providerName,
                type: "HealthCheck",
                group: "Route53",
              }),
              find(eq(get("live.Arn"), HealthCheck)),
              get("id"),
            ])(),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#describeEndpoint-property
  getById: {
    method: "describeEndpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#listEndpoints-property
  getList: {
    method: "listEndpoints",
    getParam: "Endpoints",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#createEndpoint-property
  create: {
    method: "createEndpoint",
    shouldRetryOnExceptionMessages: [
      "cannot be assumed by principal 'events.amazonaws.com'",
    ],
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("State"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#updateEndpoint-property
  update: {
    method: "updateEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#deleteEndpoint-property
  destroy: {
    method: "deleteEndpoint",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole, eventBuses, route53HealthCheck },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        EventBuses: pipe([
          () => eventBuses,
          map((eventBus) => ({
            EventBusArn: getField(eventBus, "Arn"),
          })),
        ])(),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          RoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => route53HealthCheck,
        defaultsDeep({
          RoutingConfig: {
            FailoverConfig: {
              Primary: {
                HealthCheck: getField(route53HealthCheck, "Arn"),
              },
            },
          },
        })
      ),
    ])(),
});
