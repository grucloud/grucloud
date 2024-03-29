// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "Terraform API Gateway HTTP API to EventBridge",
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
      api: "Terraform API Gateway HTTP API to EventBridge",
      stage: "Terraform API Gateway HTTP API to EventBridge::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationSubtype: "EventBridge-PutEvents",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        DetailType: "MyDetailType",
        Detail: "$request.body.Detail",
        Source: "demo.apigw",
      },
    }),
    dependencies: ({}) => ({
      api: "Terraform API Gateway HTTP API to EventBridge",
      role: "terraform-20230207223115042500000004",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "POST /",
    }),
    dependencies: ({}) => ({
      api: "Terraform API Gateway HTTP API to EventBridge",
      integration:
        "integration::Terraform API Gateway HTTP API to EventBridge::eventBusDefault",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
    }),
    dependencies: ({}) => ({
      api: "Terraform API Gateway HTTP API to EventBridge",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({ config }) => ({
      EventPattern: {
        account: [`${config.accountId()}`],
        source: ["demo.apigw"],
      },
      Name: "terraform-20230207223115042400000001",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "terraform-20230207223208574200000007",
    }),
    dependencies: ({ config }) => ({
      rule: "terraform-20230207223115042400000001",
      lambdaFunction: `apigw-http-eventbridge-terraform-demo-${config.accountId()}`,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "terraform-20230207223115042400000003",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["terraform-20230207223208573700000006"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "terraform-20230207223115042500000004",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["terraform-20230207223115042400000002"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "terraform-20230207223115042400000002",
      PolicyDocument: {
        Statement: [
          {
            Action: ["events:PutEvents"],
            Effect: "Allow",
            Resource: `arn:aws:events:${
              config.region
            }:${config.accountId()}:event-bus/default`,
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "terraform-20230207223208573700000006",
      PolicyDocument: {
        Statement: [
          {
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Effect: "Allow",
            Resource: `arn:aws:logs:${
              config.region
            }:${config.accountId()}:log-group:/aws/lambda/apigw-http-eventbridge-terraform-demo-${config.accountId()}:*:*`,
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "apigw-http-eventbridge-terraform-demo-840541460064",
        Handler: "LambdaFunction.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "terraform-20230207223115042400000003",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "apigw-http-eventbridge-terraform-demo-840541460064",
          Principal: "events.amazonaws.com",
          StatementId: "AllowExecutionFromCloudWatch",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/terraform-20230207223115042400000001`,
        },
      ],
    }),
    dependencies: ({ config }) => ({
      lambdaFunction: `apigw-http-eventbridge-terraform-demo-${config.accountId()}`,
    }),
  },
];
