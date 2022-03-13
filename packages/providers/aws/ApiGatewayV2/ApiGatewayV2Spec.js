const assert = require("assert");
const { pipe, map, omit, tap, eq, get, pick } = require("rubico");
const { when } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { compareAws, isOurMinionObject } = require("../AwsCommon");
const { Api } = require("./Api");
const { Stage } = require("./Stage");
const { Deployment } = require("./Deployment");
const { Route } = require("./Route");
const { Integration } = require("./Integration");
const { DomainName } = require("./DomainName");
const { ApiMapping } = require("./ApiMapping");
const { Authorizer } = require("./Authorizer");
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "ApiGatewayV2";

const compareApiGatewayV2 = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "DomainName",
      Client: DomainName,
      propertiesDefault: {
        ApiMappingSelectionExpression: "$request.basepath",
      },
      omitProperties: ["DomainName", "DomainNameConfigurations"],
      filterLive: () =>
        pipe([
          when(
            eq(get("ApiMappingSelectionExpression"), "$request.basepath"),
            omit(["ApiMappingSelectionExpression"])
          ),
        ]),
      dependencies: {
        certificate: { type: "Certificate", group: "ACM" },
      },
    },
    {
      type: "Api",
      Client: Api,
      omitProperties: [
        "ApiEndpoint",
        "ApiId",
        "CreatedDate",
        "AccessLogSettings.DestinationArn",
      ],
      filterLive: () =>
        pipe([
          pick([
            "ProtocolType",
            "ApiKeySelectionExpression",
            "DisableExecuteApiEndpoint",
            "RouteSelectionExpression",
            "AccessLogSettings",
          ]),
        ]),
    },
    {
      type: "Stage",
      Client: Stage,
      propertiesDefault: {
        RouteSettings: {},
        DefaultRouteSettings: {
          DetailedMetricsEnabled: false,
        },
        StageVariables: {},
      },
      omitProperties: [
        "CreatedDate",
        "DeploymentId",
        "LastUpdatedDate",
        "AccessLogSettings.DestinationArn",
      ],
      filterLive: () =>
        pipe([
          pick(["AccessLogSettings", "StageVariables"]),
          omitIfEmpty(["StageVariables"]),
        ]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        logGroup: { type: "LogGroup", group: "CloudWatchLogs" },
      },
    },
    {
      type: "Authorizer",
      Client: Authorizer,
      omitProperties: ["AuthorizerId", "ApiName"],
      filterLive: () =>
        pick([
          "AuthorizerType",
          "IdentitySource",
          "AuthorizerPayloadFormatVersion",
          "AuthorizerResultTtlInSeconds",
          "EnableSimpleResponses",
          "IdentityValidationExpression",
          "JwtConfiguration",
        ]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
      },
    },
    {
      type: "ApiMapping",
      Client: ApiMapping,
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ domainName, api, stage }) => {
            assert(domainName);
            assert(api);
            assert(stage);
          }),
          ({ domainName, api, stage }) =>
            `apimapping::${domainName.name}::${api.name}::${stage.name}::${properties.ApiMappingKey}`,
        ])(),
      omitProperties: ["ApiMappingId", "ApiName"],
      filterLive: () => pipe([pick(["ApiMappingKey"])]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        domainName: { type: "DomainName", group: "ApiGatewayV2", parent: true },
        stage: { type: "Stage", group: "ApiGatewayV2" },
      },
    },
    {
      type: "Integration",
      Client: Integration,
      inferName: ({ properties, dependencies }) =>
        pipe([
          //TODO other target
          dependencies,
          ({ api, lambdaFunction }) =>
            `integration::${api.name}::${lambdaFunction.name}`,
        ])(),
      propertiesDefault: { TimeoutInMillis: 30e3, Description: "" },
      omitProperties: ["RouteId", "IntegrationId", "ApiName"],
      filterLive: () =>
        pick([
          "ConnectionType",
          "Description",
          "IntegrationMethod",
          "IntegrationType",
          "PayloadFormatVersion",
        ]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        lambdaFunction: { type: "Function", group: "Lambda" },
      },
    },
    {
      type: "Route",
      Client: Route,
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          ({ api }) => `route::${api.name}::${properties.RouteKey}`,
        ])(),
      omitProperties: ["RouteId", "ApiName", "ApiId", "Target", "AuthorizerId"],
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        integration: {
          type: "Integration",
          group: "ApiGatewayV2",
          parent: true,
        },
        authorizer: { type: "Authorizer", group: "ApiGatewayV2" },
      },
    },
    {
      type: "Deployment",
      //TODO
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Route",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::Integration",
      ],
      Client: Deployment,
      inferName: ({ properties, dependencies }) =>
        pipe([dependencies, ({ api }) => `deployment::${api.name}`])(),
      omitProperties: [
        "StageName",
        "CreatedDate",
        "DeploymentId",
        "DeploymentStatus",
        "ApiName",
      ],
      propertiesDefault: { AutoDeployed: false, Description: "" },
      filterLive: () => pick(["Description"]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        stage: { type: "Stage", group: "ApiGatewayV2", parent: true },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareApiGatewayV2({}),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
    })
  ),
]);
