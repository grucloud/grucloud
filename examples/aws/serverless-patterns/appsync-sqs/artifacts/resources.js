// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "GraphqlApi",
    group: "AppSync",
    name: "ToSqSApi",
    properties: ({}) => ({
      authenticationType: "API_KEY",
      xrayEnabled: false,
      apiKeys: [{}],
      schemaFile: "ToSqSApi.graphql",
    }),
  },
  {
    type: "DataSource",
    group: "AppSync",
    name: "sqs",
    properties: ({ config }) => ({
      type: "HTTP",
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
    }),
    dependencies: () => ({
      graphqlApi: "ToSqSApi",
      serviceRole: "CdkAppSyncSqSStack-ApisqsServiceRole50810242-HDLGB9CWGUOH",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Query",
      fieldName: "sendMessage",
      requestMappingTemplate:
        '\n#set ($body = "Action=SendMessage&Version=2012-11-05")\n#set ($messageBody = $util.urlEncode($util.toJson($ctx.args)))\n#set ($queueUrl = $util.urlEncode("https://sqs.us-east-1.amazonaws.com/840541460064/CdkAppSyncSqSStack-queue276F7297-CwCYIMaMj4A6"))\n#set ($body = "$body&MessageBody=$messageBody&QueueUrl=$queueUrl")\n\n{\n  "version": "2018-05-29",\n  "method": "POST",\n  "resourcePath": "/840541460064/CdkAppSyncSqSStack-queue276F7297-CwCYIMaMj4A6",\n  "params": {\n    "body": "$body",\n    "headers": {\n      "content-type": "application/x-www-form-urlencoded"\n    }\n  }\n}\n',
      responseMappingTemplate:
        '\n#if($ctx.result.statusCode == 200)\n    ##if response is 200\n    ## Because the response is of type XML, we are going to convert\n    ## the result body as a map and only get the User object.\n    $utils.toJson($utils.xml.toMap($ctx.result.body).SendMessageResponse.SendMessageResult)\n#else\n    ##if response is not 200, append the response to error block.\n    $utils.appendError($ctx.result.body, "$ctx.result.statusCode")\n    null\n#end\n',
      kind: "UNIT",
    }),
    dependencies: () => ({
      graphqlApi: "ToSqSApi",
      dataSource: "sqs",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkAppSyncSqSStack-ApisqsServiceRole50810242-HDLGB9CWGUOH",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `appsync.amazonaws.com`,
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
                }:${config.accountId()}:CdkAppSyncSqSStack-queue276F7297-CwCYIMaMj4A6`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ApisqsServiceRoleDefaultPolicy74B04AEB",
        },
      ],
    }),
    dependencies: () => ({
      queue: "CdkAppSyncSqSStack-queue276F7297-CwCYIMaMj4A6",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    name: "CdkAppSyncSqSStack-queue276F7297-CwCYIMaMj4A6",
  },
];
