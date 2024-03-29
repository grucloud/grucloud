const assert = require("assert");
const { pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("loadBalancerName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ loadBalancerName }) => {
    assert(loadBalancerName);
  }),
  pick(["loadBalancerName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ name }) => {
      assert(name);
    }),
    ({ name, ...other }) => ({ loadBalancerName: name, ...other }),
    // When healthCheckPath is set to "/", AWS now return the following error:
    // The HealthCheckPath value is not valid. HealthCheckPath must begin with a '/' character and only contain printable ASCII characters, without spaces
    when(eq(get("healthCheckPath"), "/"), omit(["healthCheckPath"])),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailLoadBalancer = () => ({
  type: "LoadBalancer",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "dnsName",
    "instanceHealthSummary",
    "state",
    "tlsCertificateSummaries",
    "publicPorts",
    "protocol",
    "location",
  ],
  inferName: () => get("loadBalancerName"),
  findName: () =>
    pipe([
      get("loadBalancerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("loadBalancerName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(payload.loadBalancerName);
        }),
        () => diff,
        tap.if(
          // healthCheckPath
          get("liveDiff.updated.healthCheckPath"),
          pipe([
            tap((params) => {
              assert(payload.loadBalancerName);
            }),
            () => ({
              loadBalancerName: payload.loadBalancerName,
              attributeName: "HealthCheckPath",
              attributeValue: payload.healthCheckPath,
            }),
            endpoint().updateLoadBalancerAttribute,
          ])
        ),
        tap.if(
          // httpsRedirectionEnabled
          get("liveDiff.updated.httpsRedirectionEnabled"),
          pipe([
            () => ({
              loadBalancerName: payload.loadBalancerName,
              attributeName: "HttpsRedirectionEnabled",
              attributeValue: payload.httpsRedirectionEnabled
                ? "true"
                : "false",
            }),
            endpoint().updateLoadBalancerAttribute,
          ])
        ),
        // SessionStickinessEnabled
        tap.if(
          get("liveDiff.updated.configurationOptions.SessionStickinessEnabled"),
          pipe([
            () => ({
              loadBalancerName: payload.loadBalancerName,
              attributeName: "SessionStickinessEnabled",
              attributeValue:
                payload.configurationOptions.SessionStickinessEnabled,
            }),
            endpoint().updateLoadBalancerAttribute,
          ])
        ),
        // SessionStickiness_LB_CookieDurationSeconds
        tap.if(
          get(
            "liveDiff.updated.configurationOptions.SessionStickiness_LB_CookieDurationSeconds"
          ),
          pipe([
            () => ({
              loadBalancerName: payload.loadBalancerName,
              attributeName: "SessionStickiness_LB_CookieDurationSeconds",
              attributeValue:
                payload.configurationOptions
                  .SessionStickiness_LB_CookieDurationSeconds,
            }),
            endpoint().updateLoadBalancerAttribute,
          ])
        ),
        // tlsPolicyName
        tap.if(
          get("liveDiff.updated.tlsPolicyName"),
          pipe([
            () => ({
              loadBalancerName: payload.loadBalancerName,
              attributeName: "TlsPolicyName",
              attributeValue: payload.tlsPolicyName,
            }),
            endpoint().updateLoadBalancerAttribute,
          ])
        ),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getLoadBalancer-property
  getById: {
    method: "getLoadBalancer",
    getField: "loadBalancer",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getLoadBalancers-property
  getList: {
    method: "getLoadBalancers",
    getParam: "loadBalancers",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createLoadBalancer-property
  create: {
    method: "createLoadBalancer",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("state"), "active")]),
    isInstanceError: pipe([eq(get("state"), "failed")]),
    getErrorMessage: get("state", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteLoadBalancer-property
  destroy: {
    method: "deleteLoadBalancer",
    pickId,
  },
});
