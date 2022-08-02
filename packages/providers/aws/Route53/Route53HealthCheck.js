const assert = require("assert");
const { pipe, tap, get, eq, switchCase, assign } = require("rubico");
const { defaultsDeep, prepend, includes, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, getNewCallerReference } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./Route53Common");

const ResourceType = "healthcheck";

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
              prepend("heathcheck::RECOVERY_CONTROL::"),
            ])(),
        ]),
        tap((params) => {
          assert(true);
        }),
      ])(),
    findId: pipe([get("live.Id")]),
    getByName: getByNameCore,
    tagResource: tagResource({ ResourceType }),
    untagResource: untagResource({ ResourceType }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { routingControl },
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
