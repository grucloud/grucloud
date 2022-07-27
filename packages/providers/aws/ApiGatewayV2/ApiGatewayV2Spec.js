const assert = require("assert");
const {
  pipe,
  map,
  omit,
  tap,
  eq,
  get,
  pick,
  switchCase,
  and,
  filter,
} = require("rubico");
const {
  pluck,
  when,
  defaultsDeep,
  append,
  callProp,
  find,
  isEmpty,
  last,
  includes,
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

const dependencyIdApi =
  ({ lives, config }) =>
  (live) =>
    `arn:aws:execute-api:${config.region}:${config.accountId()}:${live.ApiId}`;

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
        certificate: {
          type: "Certificate",
          group: "ACM",
          dependencyIds: ({ lives, config }) =>
            pipe([get("DomainNameConfigurations"), pluck("CertificateArn")]),
        },
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
      inferName: get("properties.Name"),
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
      inferName: get("properties.StageName"),
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
        api: {
          type: "Api",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: dependencyIdApi,
        },
        logGroup: {
          type: "LogGroup",
          group: "CloudWatchLogs",
          dependencyId: ({ lives, config }) =>
            get("AccessLogSettings.DestinationArn"),
        },
      },
    },
    {
      type: "Authorizer",
      Client: Authorizer,
      inferName: get("properties.Name"),
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
        api: {
          type: "Api",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: dependencyIdApi,
        },
        userPool: {
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("JwtConfiguration.Issuer", ""),
              callProp("split", "/"),
              last,
              switchCase([
                isEmpty,
                () => undefined,
                (Id) =>
                  pipe([
                    () =>
                      lives.getByType({
                        type: "UserPool",
                        group: "CognitoIdentityServiceProvider",
                        providerName: config.providerName,
                      }),
                    filter(eq(get("live.Id"), Id)),
                  ])(),
              ]),
            ]),
        },
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
        api: {
          type: "Api",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: dependencyIdApi,
        },
        domainName: {
          type: "DomainName",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: ({ lives, config }) => get("DomainName"),
        },
        stage: {
          type: "Stage",
          group: "ApiGatewayV2",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    providerName: config.providerName,
                    type: "Stage",
                    group: "ApiGatewayV2",
                  }),
                tap((params) => {
                  assert(true);
                }),
                find(
                  and([
                    eq(get("live.StageName"), live.Stage),
                    eq(get("live.ApiId"), live.ApiId),
                  ])
                ),
                get("id"),
              ])(),
        },
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
        api: {
          type: "Api",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: dependencyIdApi,
        },
        listener: {
          type: "Listener",
          group: "ElasticLoadBalancingV2",
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "Listener",
                    group: "ElasticLoadBalancingV2",
                    providerName: config.providerName,
                  }),
                filter(eq(get("id"), live.IntegrationUri)),
              ])(),
        }, //Integration name depends on listener name
        vpcLink: {
          type: "VpcLink",
          group: "ApiGatewayV2",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "VpcLink",
                    group: "ApiGatewayV2",
                    providerName: config.providerName,
                  }),
                filter(eq(get("id"), live.ConnectionId)),
              ])(),
        },
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "Function",
                    group: "Lambda",
                    providerName: config.providerName,
                  }),
                find(
                  pipe([get("id"), (id) => includes(id)(live.IntegrationUri)])
                ),
              ])(),
        },
        eventBus: {
          type: "EventBus",
          group: "CloudWatchEvents",
          dependencyId: ({ lives, config }) =>
            get("RequestParameters.EventBusName"),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("CredentialsArn"),
        },
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
        api: {
          type: "Api",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: dependencyIdApi,
        },
        integration: {
          type: "Integration",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([get("Target", ""), callProp("replace", "integrations/", "")]),
        },
        authorizer: {
          type: "Authorizer",
          group: "ApiGatewayV2",
          dependencyId: ({ lives, config }) => get("AuthorizerId"),
        },
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
        api: {
          type: "Api",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId: dependencyIdApi,
        },
        stage: {
          type: "Stage",
          group: "ApiGatewayV2",
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    providerName: config.providerName,
                    type: "Stage",
                    group: "ApiGatewayV2",
                  }),
                find(eq(get("live.DeploymentId"), live.DeploymentId)),
                get("id"),
              ])(),
        },
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
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SubnetIds"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
        },
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
