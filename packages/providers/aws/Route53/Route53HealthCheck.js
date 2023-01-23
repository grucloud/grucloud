const assert = require("assert");
const { pipe, tap, get, eq, switchCase, assign } = require("rubico");
const { defaultsDeep, prepend, includes, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, getNewCallerReference } = require("../AwsCommon");
const { Tagger } = require("./Route53Common");

const ResourceType = "healthcheck";

const buildArn = () =>
  pipe([
    get("Id"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([({ Id }) => ({ HealthCheckId: Id })]);

const decorate = ({ endpoint, getById }) =>
  pipe([
    getById,
    assign({
      Tags: pipe([
        ({ Id }) => ({ ResourceId: Id, ResourceType: "healthcheck" }),
        endpoint().listTagsForResource,
        get("ResourceTagSet.Tags"),
      ]),
    }),
  ]);

const model = ({ config }) => ({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53HealthCheck = ({ compare }) => ({
  type: "HealthCheck",
  package: "route-53",
  client: "Route53",
  inferName:
    ({ dependenciesSpec: { routingControl } }) =>
    (properties) =>
      pipe([
        () => properties,
        get("HealthCheckConfig"),
        switchCase([
          ({ Type }) =>
            pipe([
              () => [
                "HTTP",
                "HTTPS",
                "HTTP_STR_MATCH",
                "HTTPS_STR_MATCH",
                "TCP",
              ],
              includes(Type),
            ])(),
          ({ Type, FullyQualifiedDomainName, IPAddress }) =>
            `heathcheck::${Type}::${FullyQualifiedDomainName || IPAddress}`,
          //TODO
          eq(get("Type"), "CALCULATED"),
          pipe([get("ResourcePath"), prepend("heathcheck::CALCULATED::")]),
          eq(get("Type"), "CLOUDWATCH_METRIC"),
          pipe([
            get("AlarmIdentifier.Name"),
            prepend("heathcheck::CLOUDWATCH_METRIC::"),
          ]),
          eq(get("Type"), "RECOVERY_CONTROL"),
          () => `heathcheck::RECOVERY_CONTROL::${routingControl}`,
        ]),
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("HealthCheckConfig"),
        switchCase([
          ({ Type }) =>
            pipe([
              () => [
                "HTTP",
                "HTTPS",
                "HTTP_STR_MATCH",
                "HTTPS_STR_MATCH",
                "TCP",
              ],
              includes(Type),
            ])(),
          ({ Type, FullyQualifiedDomainName, IPAddress }) =>
            `heathcheck::${Type}::${FullyQualifiedDomainName || IPAddress}`,
          //TODO
          eq(get("Type"), "CALCULATED"),
          pipe([get("ResourcePath"), prepend("heathcheck::CALCULATED::")]),
          eq(get("Type"), "CLOUDWATCH_METRIC"),
          pipe([
            get("AlarmIdentifier.Name"),
            prepend("heathcheck::CLOUDWATCH_METRIC::"),
          ]),
          eq(get("Type"), "RECOVERY_CONTROL"),
          pipe([
            get("RoutingControlArn"),
            lives.getById({
              type: "RoutingControl",
              group: "Route53RecoveryControlConfig",
              config: config.providerName,
            }),
            get("name"),
            prepend("heathcheck::RECOVERY_CONTROL::"),
          ]),
        ]),
        tap((params) => {
          assert(true);
        }),
      ])(),
  findId: () => pipe([get("Id")]),
  dependencies: {
    cloudWatchAlarm: {
      type: "Alarm",
      group: "CloudWatch",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AlarmIdentifier.Name"),
          lives.getByName({
            type: "Alarm",
            group: "CloudWatch",
            config: config.providerName,
          }),
          get("id"),
        ]),
    },
    routingControl: {
      type: "RoutingControl",
      group: "Route53RecoveryControlConfig",
      dependencyId: ({ lives, config }) =>
        get("HealthCheckConfig.RoutingControlArn"),
    },
  },
  compare: compare({
    filterTarget: () => pipe([() => ({})]),
    filterLive: () => pipe([() => ({})]),
  }),
  propertiesDefault: {
    HealthCheckConfig: {
      Inverted: false,
      Disabled: false,
    },
  },
  omitProperties: [
    "Id",
    "CallerReference",
    "LinkedService",
    "HealthCheckConfig.RoutingControlArn",
    "HealthCheckVersion",
  ],
  ignoreErrorCodes: ["NoSuchHealthCheck"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getHealthCheck-property
  getById: {
    method: "getHealthCheck",
    getField: "HealthCheck",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHealthChecks-property
  getList: {
    method: "listHealthChecks",
    getParam: "HealthChecks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHealthCheck-property
  create: {
    method: "createHealthCheck",
    pickCreated: ({ payload }) => pipe([get("HealthCheck")]),
    postCreate: ({ endpoint, payload: { Tags } }) =>
      pipe([
        ({ Id }) => ({ ResourceId: Id, AddTags: Tags, ResourceType }),
        endpoint().changeTagsForResource,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#updateHealthCheck-property
  update: {
    method: "updateHealthCheck",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"]), defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHealthCheck-property
  destroy: { method: "deleteHealthCheck", pickId },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
      additionalParams: pipe([() => ({ ResourceType })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { routingControl },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        CallerReference: getNewCallerReference(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => routingControl,
        defaultsDeep({
          HealthCheckConfig: {
            RoutingControlArn: getField(routingControl, "RoutingControlArn"),
          },
        })
      ),
    ])(),
});
