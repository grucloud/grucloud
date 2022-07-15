const assert = require("assert");
const { pipe, map, omit, tap, eq, get, pick, switchCase } = require("rubico");
const {
  when,
  defaultsDeep,
  append,
  callProp,
  find,
  isEmpty,
} = require("rubico/x");
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

const { ApiGatewayV2VpcLink } = require("./ApiGatewayV2VpcLink");
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
        "ApiId",
      ],
      filterLive: () => pipe([omitIfEmpty(["StageVariables"])]),
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
            "Name",
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
      inferName: ({
        properties: { ApiMappingKey },
        dependenciesSpec: { domainName, api, stage },
      }) =>
        pipe([
          tap(() => {
            assert(domainName);
            assert(api);
            assert(stage);
            //TODO
            //assert(ApiMappingKey);
          }),
          () => `apimapping::${domainName}::${api}::${stage}::${ApiMappingKey}`,
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
      inferName: ({
        properties,
        dependenciesSpec: { api, lambdaFunction, listener, eventBus },
      }) =>
        pipe([
          //TODO other target
          tap(() => {
            assert(api);
          }),
          () =>
            pipe([
              () => `integration::${api}`,
              switchCase([
                () => lambdaFunction,
                append(`::${lambdaFunction}`),
                () => eventBus,
                append(`::${eventBus}`),
                () => listener,
                append(`::${listener}`),
                append(`::NO-INTEGRATION`),
              ]),
            ])(),
        ])(),
      propertiesDefault: { TimeoutInMillis: 30e3, Description: "" },
      omitProperties: [
        "RouteId",
        "ConnectionId",
        "IntegrationId",
        "IntegrationUri",
        "ApiName",
        "RequestParameters.EventBusName",
        "CredentialsArn",
        "ApiId",
      ],
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        listener: {
          type: "Listener",
          group: "ElasticLoadBalancingV2",
          parent: true,
        }, //Integration name depends on listener name
        vpcLink: { type: "VpcLink", group: "ApiGatewayV2" },
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
      inferName: ({ properties: { RouteKey }, dependenciesSpec: { api } }) =>
        pipe([
          tap((params) => {
            assert(RouteKey);
            assert(api);
          }),
          () => `route::${api}::${RouteKey}`,
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
      Client: Deployment,
      ignoreResource: (xxx) =>
        pipe([
          get("dependencies"),
          find(eq(get("type"), "Stage")),
          get("ids"),
          isEmpty,
        ]),
      inferName: ({ properties, dependenciesSpec: { api } }) =>
        pipe([
          tap((params) => {
            assert(api);
          }),
          () => `deployment::${api}`,
        ])(),
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
        route: {
          type: "Route",
          group: "ApiGatewayV2",
          dependsOnTypeOnly: true,
        },
        integration: {
          type: "Integration",
          group: "ApiGatewayV2",
          dependsOnTypeOnly: true,
        },
      },
    },
    {
      type: "VpcLink",
      Client: ApiGatewayV2VpcLink,
      dependencies: {
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
      },
      omitProperties: [
        "Name",
        "CreatedDate",
        "SecurityGroupIds",
        "SubnetIds",
        "VpcLinkId",
        "VpcLinkStatus",
        "VpcLinkStatusMessage",
        "VpcLinkVersion",
      ],
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
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
