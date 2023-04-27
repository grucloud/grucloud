// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    dependencies: ({}) => ({
      cloudwatchRole:
        "StaticSiteStack-apiGatewayCloudWatchRole76EFA7C8-AMSET8KFLYBA",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({ config }) => ({
      Description: "EventRule",
      EventPattern: {
        account: [`${config.accountId()}`],
        source: ["demo.sqs"],
      },
      Name: "sam-app-EventRule-BOTTWWTZIDB3",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "SQSqueue",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-EventRule-BOTTWWTZIDB3",
      sqsQueue: "sam-app-MySqsQueue-IF2Nnb8apLcN",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "StaticSiteStack-apiGatewayCloudWatchRole76EFA7C8-AMSET8KFLYBA",
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
      AttachedPolicies: [
        {
          PolicyName: "AmazonAPIGatewayPushToCloudWatchLogs",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "StaticSiteStack-apiGatewayCloudWatchRole76EFA7C8-EUQR6OJ0QPPN",
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
      AttachedPolicies: [
        {
          PolicyName: "AmazonAPIGatewayPushToCloudWatchLogs",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "staticsitestack-staticbucket49ce0992-13kb3z9m9fklx",
      LifecycleConfiguration: {
        Rules: [
          {
            ID: "YjZlNjBkMDktZDhkMS00ZWM1LTgyODItZWZmNjRjNzhlZDY2",
            Filter: {
              Prefix: "",
            },
            Status: "Enabled",
            AbortIncompleteMultipartUpload: {
              DaysAfterInitiation: 7,
            },
          },
          {
            ID: "YzkxNTYyMGQtMzMwYS00ZWM5LWE4OGQtNDQ1NjMzYWE1NzI5",
            Filter: {
              Prefix: "",
            },
            Status: "Enabled",
            NoncurrentVersionExpiration: {
              NoncurrentDays: 7,
            },
          },
        ],
      },
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "staticsitestack-staticbucket49ce0992-1u7h0phacigqf",
      LifecycleConfiguration: {
        Rules: [
          {
            ID: "MjcyY2VjYzUtZTE2OS00ODQ2LTgyNzgtMWQxMDk1OWEzMjdh",
            Filter: {
              Prefix: "",
            },
            Status: "Enabled",
            AbortIncompleteMultipartUpload: {
              DaysAfterInitiation: 7,
            },
          },
          {
            ID: "MWIzMDE4M2YtODYwOC00YzNiLTg3ZDItYTk2YzdkYWYxZDQy",
            Filter: {
              Prefix: "",
            },
            Status: "Enabled",
            NoncurrentVersionExpiration: {
              NoncurrentDays: 7,
            },
          },
        ],
      },
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Statement: [
            {
              Action: "SQS:SendMessage",
              Effect: "Allow",
              Principal: {
                Service: "events.amazonaws.com",
              },
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:sam-app-MySqsQueue-IF2Nnb8apLcN`,
            },
          ],
          Version: "2008-10-17",
        },
      },
      QueueName: "sam-app-MySqsQueue-IF2Nnb8apLcN",
    }),
  },
];
