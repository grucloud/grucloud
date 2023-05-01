// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DataSource",
    group: "AppSync",
    properties: ({ config }) => ({
      httpConfig: {
        authorizationConfig: {
          authorizationType: "AWS_IAM",
          awsIamConfig: {
            signingRegion: `${config.region}`,
            signingServiceName: "sqs",
          },
        },
        endpoint: `https://sqs.${config.region}.amazonaws.com`,
      },
      name: "sqs",
      type: "HTTP",
    }),
    dependencies: ({}) => ({
      graphqlApi: "ToSqSApi",
      serviceRole: "CdkAppSyncSqSStack-ApisqsServiceRole50810242-6VLJHOBNQI7H",
    }),
  },
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({}) => ({
      name: "ToSqSApi",
      authenticationType: "API_KEY",
      xrayEnabled: false,
      apiKeys: [{}],
      schemaFile: "ToSqSApi.graphql",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "sendMessage",
      kind: "UNIT",
      requestMappingTemplate: `
#set ($body = "Action=SendMessage&Version=2012-11-05")
#set ($messageBody = $util.urlEncode($util.toJson($ctx.args)))
#set ($queueUrl = $util.urlEncode("https://sqs.us-east-1.amazonaws.com/840541460064/CdkAppSyncSqSStack-queue276F7297-0rAF1nELClh9"))
#set ($body = "$body&MessageBody=$messageBody&QueueUrl=$queueUrl")

{
  "version": "2018-05-29",
  "method": "POST",
  "resourcePath": "/840541460064/CdkAppSyncSqSStack-queue276F7297-0rAF1nELClh9",
  "params": {
    "body": "$body",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    }
  }
}
`,
      responseMappingTemplate: `
#if($ctx.result.statusCode == 200)
    ##if response is 200
    ## Because the response is of type XML, we are going to convert
    ## the result body as a map and only get the User object.
    $utils.toJson($utils.xml.toMap($ctx.result.body).SendMessageResponse.SendMessageResult)
#else
    ##if response is not 200, append the response to error block.
    $utils.appendError($ctx.result.body, "$ctx.result.statusCode")
    null
#end
`,
      typeName: "Query",
    }),
    dependencies: ({}) => ({
      dataSource: "sqs",
      graphqlApi: "ToSqSApi",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "CdkAppSyncSqSStack-ApisqsServiceRole50810242-6VLJHOBNQI7H",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appsync.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "sqs:SendMessage",
                  "sqs:GetQueueAttributes",
                  "sqs:GetQueueUrl",
                ],
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:CdkAppSyncSqSStack-queue276F7297-0rAF1nELClh9`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ApisqsServiceRoleDefaultPolicy74B04AEB",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-WorkflowExecutionRole-WM87YTOPGZ2D",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "events:PutEvents",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/sam-app-EventBus`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AllowEventBridgePutEvents",
        },
      ],
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "CdkAppSyncSqSStack-queue276F7297-0rAF1nELClh9",
    }),
  },
];
