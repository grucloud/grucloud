// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-TopicConsumerFunction1Role-1CWCD3G6QCTG6",
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
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-TopicConsumerFunction1-OL7tADpZDByC",
        Handler: "app.handler",
        Runtime: "nodejs12.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-TopicConsumerFunction1Role-1CWCD3G6QCTG6",
    }),
  },
  { type: "Topic", group: "SNS", name: "sam-app-MySnsTopic-1Q2VS8SMOPR20" },
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      Attributes: {},
    }),
    dependencies: ({}) => ({
      snsTopic: "sam-app-MySnsTopic-1Q2VS8SMOPR20",
      lambdaFunction: "sam-app-TopicConsumerFunction1-OL7tADpZDByC",
    }),
  },
];