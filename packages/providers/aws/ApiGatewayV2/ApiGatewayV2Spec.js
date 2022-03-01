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

module.exports = pipe([
  () => [
    {
      type: "DomainName",
      dependsOn: ["ACM::Certificate"],
      Client: DomainName,
      compare: compareAws({
        filterTarget: () =>
          pipe([
            defaultsDeep({
              ApiMappingSelectionExpression: "$request.basepath",
            }),
            omit(["DomainNameConfigurations"]),
          ]),
        filterLive: () => pipe([omit(["DomainNameConfigurations"])]),
      }),
      filterLive: () =>
        pipe([
          omit(["DomainName", "DomainNameConfigurations"]),
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
      compare: compareAws({
        filterLive: () => pipe([omit(["ApiEndpoint", "ApiId", "CreatedDate"])]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "ProtocolType",
            "ApiKeySelectionExpression",
            "DisableExecuteApiEndpoint",
            "RouteSelectionExpression",
            "AccessLogSettings",
          ]),
          omit(["AccessLogSettings.DestinationArn"]),
        ]),
    },
    {
      type: "Stage",
      dependsOn: ["ApiGatewayV2::Api", "CloudWatchLogs::LogGroup"],
      dependsOnList: ["ApiGatewayV2::Api"],
      Client: Stage,
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            defaultsDeep({
              RouteSettings: [],
              DefaultRouteSettings: {
                DetailedMetricsEnabled: false,
              },
              StageVariables: {},
            }),
          ]),
        filterLive: () =>
          pipe([omit(["CreatedDate", "DeploymentId", "LastUpdatedDate"])]),
      }),
      filterLive: () =>
        pipe([
          pick(["AccessLogSettings", "StageVariables"]),
          omitIfEmpty(["StageVariables"]),
          omit(["AccessLogSettings.DestinationArn"]),
        ]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        logGroup: { type: "LogGroup", group: "CloudWatchLogs" },
      },
    },
    {
      type: "Authorizer",
      dependsOn: ["ApiGatewayV2::Api"],
      dependsOnList: ["ApiGatewayV2::Api"],
      Client: Authorizer,
      compare: compareAws({
        filterLive: () => pipe([omit(["AuthorizerId", "ApiName"])]),
      }),
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
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::DomainName",
      ],
      dependsOnList: ["ApiGatewayV2::DomainName", "ApiGatewayV2::Api"],
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
      compare: compareAws({
        filterLive: () => pipe([omit(["ApiMappingId", "ApiName"])]),
      }),
      filterLive: () => pipe([pick(["ApiMappingKey"])]),
      dependencies: {
        api: { type: "Api", group: "ApiGatewayV2", parent: true },
        domainName: { type: "DomainName", group: "ApiGatewayV2", parent: true },
        stage: { type: "Stage", group: "ApiGatewayV2" },
      },
    },
    {
      type: "Integration",
      dependsOn: ["ApiGatewayV2::Api", "Lambda::Function"],
      dependsOnList: ["ApiGatewayV2::Api"],
      Client: Integration,
      inferName: ({ properties, dependencies }) =>
        pipe([
          //TODO other target
          dependencies,
          ({ api, lambdaFunction }) =>
            `integration::${api.name}::${lambdaFunction.name}`,
        ])(),
      compare: compareAws({
        filterTarget: () =>
          pipe([defaultsDeep({ TimeoutInMillis: 30e3, Description: "" })]),
        filterLive: () =>
          pipe([
            omit(["RouteId", "IntegrationId", "ApiName"]),
            defaultsDeep({ Description: "" }),
          ]),
      }),
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
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Integration",
        "ApiGatewayV2::Authorizer",
      ],
      dependsOnList: ["ApiGatewayV2::Api", "ApiGatewayV2::Integration"],
      Client: Route,
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          ({ api }) => `route::${api.name}::${properties.RouteKey}`,
        ])(),
      compare: compareAws({
        filterLive: () => pipe([omit(["RouteId", "ApiName"])]),
      }),
      filterLive: () =>
        pipe([omit(["RouteId", "ApiName", "ApiId", "Target", "AuthorizerId"])]),
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
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Route",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::Integration",
      ],
      dependsOnList: ["ApiGatewayV2::Api", "ApiGatewayV2::Stage"],
      Client: Deployment,
      inferName: ({ properties, dependencies }) =>
        pipe([dependencies, ({ api }) => `deployment::${api.name}`])(),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            defaultsDeep({ AutoDeployed: false, Description: "" }),
            omit(["StageName"]),
          ]),
        filterLive: () =>
          pipe([
            omit([
              "CreatedDate",
              "DeploymentId",
              "DeploymentStatus",
              "ApiName",
            ]),
            defaultsDeep({ Description: "" }),
          ]),
      }),
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
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
    })
  ),
]);
