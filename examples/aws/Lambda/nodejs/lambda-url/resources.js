// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "my-function-url-role-t2xxsa8e",
      Path: "/service-role/",
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
      policies: [
        "AWSLambdaBasicExecutionRole-9c3ecdb3-2e09-4c84-b290-82222512354a",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "AWSLambdaBasicExecutionRole-9c3ecdb3-2e09-4c84-b290-82222512354a",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "logs:CreateLogGroup",
            Resource: `arn:aws:logs:${config.region}:${config.accountId()}:*`,
          },
          {
            Effect: "Allow",
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/my-function-url:*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "my-function-url",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      },
      FunctionUrlConfig: {
        AuthType: "NONE",
        Cors: {
          AllowOrigins: ["*"],
        },
      },
    }),
    dependencies: ({}) => ({
      role: "my-function-url-role-t2xxsa8e",
    }),
  },
];