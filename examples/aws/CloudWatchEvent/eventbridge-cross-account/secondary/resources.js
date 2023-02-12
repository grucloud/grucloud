// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "eb-source",
      Tags: {
        "httpapi:createdBy": "SAM",
      },
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: ({}) => ({
      api: "eb-source",
      stage: "eb-source::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: ({}) => ({
      api: "eb-source",
      lambdaFunction: "eb-source-WebhookFunction-WcSn4y9a1e6V",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "GET /",
    }),
    dependencies: ({}) => ({
      api: "eb-source",
      integration:
        "integration::eb-source::eb-source-WebhookFunction-WcSn4y9a1e6V",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
      Tags: {
        "httpapi:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      api: "eb-source",
    }),
  },
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "CrossRegionSource",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "EventRule - us-east-1 routing",
      EventPattern: {
        source: ["CrossRegionTest"],
        detail: {
          apiEvent: {
            region: ["us-east-1"],
          },
        },
      },
      Name: "eb-source-EventRuleRegion1-2AKE6VPOW44N",
    }),
    dependencies: ({}) => ({
      eventBus: "CrossRegionSource",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "Id75deb0f3-7d1b-46c4-8098-45b2cab026b4",
    }),
    dependencies: ({}) => ({
      rule: "eb-source-EventRuleRegion1-2AKE6VPOW44N",
      role: {
        name: "eb-source-EventBridgeIAMrole-1L32MS9UDXLS9",
        provider: "aws-primary",
      },
      eventBus: { name: "CrossRegionDestination", provider: "aws-primary" },
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            EVENT_BUS_NAME: "CrossRegionSource",
            EVENTSOURCE: "CrossRegionTest",
          },
        },
        FunctionName: "eb-source-WebhookFunction-WcSn4y9a1e6V",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: {
        name: "eb-source-WebhookFunctionRole-GQF2FM2Y79FE",
        provider: "aws-primary",
      },
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "eb-source-WebhookFunction-WcSn4y9a1e6V",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "eb-source-WebhookFunctionHttpApiEventPermission-GTLUVNECKV1B",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "eb-source",
            path: "live.ArnV2",
          })}/*/GET/`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "eb-source-WebhookFunction-WcSn4y9a1e6V",
      apiGatewayV2Apis: ["eb-source"],
    }),
  },
];
