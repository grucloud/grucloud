// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Send websocket data to SQS which is then processed by a Lambda",
      Name: "APIGWWebsocketSQSLambda",
      ProtocolType: "WEBSOCKET",
      RouteSelectionExpression: "$request.body.action",
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
      api: "APIGWWebsocketSQSLambda",
      stage: "APIGWWebsocketSQSLambda::production",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({ config }) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationResponseSelectionExpression:
        "${integration.response.statuscode}",
      IntegrationType: "AWS",
      IntegrationUri: `arn:aws:apigateway:${
        config.region
      }:sqs:path/${config.accountId()}/APIGWWebsocketQueue.fifo`,
      PassthroughBehavior: "NEVER",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        "integration.request.header.Content-Type":
          "'application/x-www-form-urlencoded'",
      },
      RequestTemplates: {
        $default:
          "Action=SendMessage&MessageGroupId=$input.path('$.MessageGroupId')&MessageDeduplicationId=$context.requestId&MessageAttribute.1.Name=connectionId&MessageAttribute.1.Value.StringValue=$context.connectionId&MessageAttribute.1.Value.DataType=String&MessageAttribute.2.Name=requestId&MessageAttribute.2.Value.StringValue=$context.requestId&MessageAttribute.2.Value.DataType=String&MessageBody=$input.json('$')",
      },
      TemplateSelectionExpression: "\\$default",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "APIGWWebsocketSQSLambda",
      role: "sam-app-ApiGatewayWebsocketSQSRole-1V39NB449HWBY",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "$default",
    }),
    dependencies: ({ config }) => ({
      api: "APIGWWebsocketSQSLambda",
      integration: `integration::APIGWWebsocketSQSLambda::arn:aws:apigateway:${
        config.region
      }:sqs:path/${config.accountId()}/APIGWWebsocketQueue.fifo`,
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      DefaultRouteSettings: {
        DataTraceEnabled: false,
        LoggingLevel: "OFF",
      },
      StageName: "production",
    }),
    dependencies: ({}) => ({
      api: "APIGWWebsocketSQSLambda",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-ApiGatewayWebsocketSQSRole-1V39NB449HWBY",
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
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: "sqs:SendMessage",
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:APIGWWebsocketQueue.fifo`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "APIGatewaySQSSendMessagePolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-SQSWebsocketResponseServiceRole-13ZF133MLHMTF",
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
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: "execute-api:ManageConnections",
                Effect: "Allow",
                Resource: `${getId({
                  type: "Api",
                  group: "ApiGatewayV2",
                  name: "APIGWWebsocketSQSLambda",
                  path: "live.ArnV2",
                })}/production/POST/*`,
              },
              {
                Action: [
                  "sqs:ReceiveMessage",
                  "sqs:ChangeMessageVisibility",
                  "sqs:GetQueueUrl",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:APIGWWebsocketQueue.fifo`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "SQSWebsocketResponseServiceRoleDefaultPolicy",
        },
      ],
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
    dependencies: ({}) => ({
      apiGatewayV2Apis: ["APIGWWebsocketSQSLambda"],
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-SQSWebsocketResponse-xvCVTmGEZ2xx",
      sqsQueue: "APIGWWebsocketQueue.fifo",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        Environment: {
          Variables: {
            ApiGatewayEndpoint: `${getId({
              type: "Api",
              group: "ApiGatewayV2",
              name: "APIGWWebsocketSQSLambda",
              path: "live.Endpoint",
            })}/production`,
          },
        },
        FunctionName: "sam-app-SQSWebsocketResponse-xvCVTmGEZ2xx",
        Handler: "SQSWebsocketResponse.handler",
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-SQSWebsocketResponseServiceRole-13ZF133MLHMTF",
      apiGatewayV2Apis: ["APIGWWebsocketSQSLambda"],
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      Attributes: {
        ContentBasedDeduplication: "false",
        DeduplicationScope: "queue",
        FifoQueue: "true",
        FifoThroughputLimit: "perQueue",
      },
      QueueName: "APIGWWebsocketQueue.fifo",
    }),
  },
];
