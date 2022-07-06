const assert = require("assert");
const { pipe, tap, get, eq, switchCase } = require("rubico");
const { defaultsDeep, prepend } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, getNewCallerReference } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./Route53Common");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ HealthCheckId: Id }),
]);

const model = ({ config }) => ({
  package: "route-53",
  client: "Route53",
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHealthCheck-property
  create: {
    method: "createHealthCheck",
    //TODO TAGS
    pickCreated: ({ payload }) => pipe([get("HealthCheck")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#updateHealthCheck-property
  update: {
    method: "updateHealthCheck",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"]), defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHealthCheck-property
  destroy: { method: "deleteHealthCheck", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53HealthCheck = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        () => live,
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
          ({ Type, ResourcePath }) => `heathcheck::${Type}::${ResourcePath}`,
          //TODO
          eq(get("Type"), "CALCULATED"),
          pipe([get("ResourcePath"), prepend("heathcheck::CALCULATED::")]),
          eq(get("Type"), "CLOUDWATCH_METRIC"),
          pipe([
            get("AlarmIdentifier.Name"),
            prepend("heathcheck::CLOUDWATCH_METRIC::"),
          ]),
          eq(get("Type"), "RECOVERY_CONTROL"),
          ({ RoutingControlArn }) =>
            pipe([
              () =>
                lives.getById({
                  id: RoutingControlArn,
                  type: "RoutingControl",
                  group: "Route53RecoveryControlConfig",
                  config: config.providerName,
                }),
              get("name"),
              prepend("heathcheck::RECOVERY_CONTROL"),
            ])(),
        ]),
      ]),
    findId: pipe([get("live.Id")]),
    findDependencies: ({ live, lives }) => [
      {
        type: "Alarm",
        group: "CloudWatch",
        ids: [
          pipe([
            () => live,
            get("AlarmIdentifier.Name"),
            (name) =>
              lives.getByName({
                name,
                type: "Alarm",
                group: "CloudWatch",
                config: config.providerName,
              }),
            get("id"),
          ])(),
        ],
      },
      {
        type: "RoutingControl",
        group: "Route53RecoveryControlConfig",
        ids: [pipe([() => live, get("RoutingControlArn")])()],
      },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { alarm, routingControl },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          CallerReference: getNewCallerReference(),
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
