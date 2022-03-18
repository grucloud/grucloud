const assert = require("assert");
const { pipe, map, omit, tap, eq, get, pick, switchCase } = require("rubico");
const { when, defaultsDeep, append, callProp } = require("rubico/x");
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
      propertiesDefault: {
        ProtocolType: "HTTP",
        ApiKeySelectionExpression: "$request.header.x-api-key",
        DisableExecuteApiEndpoint: false,
        RouteSelectionExpression: "$request.method $request.path",
      },
      omitProperties: [
        "ApiEndpoint",
        "ApiId",
        "CreatedDate",
        "AccessLogSettings.DestinationArn",
        "Name",
      ],
      propertiesDefault: {
        Version: "1.0",
        ProtocolType: "HTTP",
        ApiKeySelectionExpression: "$request.header.x-api-key",
        RouteSelectionExpression: "$request.method $request.path",
        DisableExecuteApiEndpoint: false,
      },
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
        "LastDeploymentStatusMessage",
      ],
      filterLive: () =>
        pipe([
          pick(["AccessLogSettings", "StageVariables", "AutoDeploy"]),
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
        pipe([
          pick([
            "AuthorizerType",
            "IdentitySource",
            "AuthorizerPayloadFormatVersion",
            "AuthorizerResultTtlInSeconds",
            "EnableSimpleResponses",
            "IdentityValidationExpression",
            "JwtConfiguration",
          ]),
          when(
            pipe([
              get("JwtConfiguration.Issuer", ""),
              callProp("startsWith", "https://cognito-idp"),
            ]),
            omit(["JwtConfiguration.Issuer"])
          ),
        ]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        userPool: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
      },
    },
    {
      type: "ApiMapping",
      Client: ApiMapping,
      //TODO inferName
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
          tap(({ api }) => {
            assert(api);
          }),
          ({ api, lambdaFunction, eventBus }) =>
            pipe([
              () => `integration::${api.name}`,
              switchCase([
                () => lambdaFunction,
                append(`::${lambdaFunction?.name}`),
                () => eventBus,
                append(`::${eventBus?.name}`),
                append(`::UNKNOWN`),
              ]),
            ])(),
        ])(),
      propertiesDefault: { TimeoutInMillis: 30e3, Description: "" },
      omitProperties: [
        "RouteId",
        "IntegrationId",
        "ApiName",
        "RequestParameters.EventBusName",
        "CredentialsArn",
      ],
      filterLive: () =>
        pipe([
          pick([
            "ConnectionType",
            "Description",
            "IntegrationMethod",
            "IntegrationType",
            "IntegrationSubtype",
            "PayloadFormatVersion",
            "RequestParameters",
            "RequestTemplates",
            "TimeoutInMillis",
          ]),
        ]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        lambdaFunction: { type: "Function", group: "Lambda" },
        eventBus: { type: "EventBus", group: "CloudWatchEvents" },
        role: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "Route",
      Client: Route,
      propertiesDefault: {
        ApiKeyRequired: false,
        AuthorizationScopes: [],
        AuthorizationType: "NONE",
        RequestModels: {},
      },
      inferName: ({ properties, dependencies }) =>
        pipe([
          tap((params) => {
            assert(properties.RouteKey);
          }),
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
        "DeploymentStatusMessage",
        "ApiName",
      ],
      compare: compareApiGatewayV2({ filterAll: () => omit(["AutoDeployed"]) }),
      propertiesDefault: { AutoDeployed: false, Description: "" },
      filterLive: () => pick(["Description", "AutoDeployed"]),
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
