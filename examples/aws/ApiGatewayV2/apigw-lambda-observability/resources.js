// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "sam-app",
      Tags: {
        Stack: "sam-app",
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
      api: "sam-app",
      stage: "sam-app::$default",
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
      api: "sam-app",
      lambdaFunction: "sam-app-SampleFunction-7LguHNIijNN9",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "GET /",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-SampleFunction-7LguHNIijNN9",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AccessLogSettings: {
        Format:
          '{ "requestId":"$context.requestId", "ip": "$context.identity.sourceIp", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod","routeKey":"$context.routeKey", "status":"$context.status","protocol":"$context.protocol", "integrationStatus": $context.integrationStatus, "integrationLatency": $context.integrationLatency, "responseLength":"$context.responseLength" }',
      },
      AutoDeploy: true,
      StageName: "$default",
      Tags: {
        Stack: "sam-app",
        "httpapi:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      logGroup: "/sam-app/APIAccessLogs",
    }),
  },
  {
    type: "Dashboard",
    group: "CloudWatch",
    properties: ({}) => ({
      DashboardBody: {
        widgets: [
          {
            height: 6,
            width: 6,
            y: 6,
            x: 6,
            type: "metric",
            properties: {
              metrics: [
                [
                  "AWS/Lambda",
                  "Invocations",
                  "FunctionName",
                  "sam-app-SampleFunction-7LguHNIijNN9",
                ],
                [".", "Errors", ".", "."],
                [".", "Throttles", ".", "."],
                [
                  ".",
                  "Duration",
                  ".",
                  ".",
                  {
                    stat: "Average",
                  },
                ],
                [
                  ".",
                  "ConcurrentExecutions",
                  ".",
                  ".",
                  {
                    stat: "Maximum",
                  },
                ],
              ],
              view: "timeSeries",
              region: "us-east-1",
              stacked: false,
              title: "Lambda",
              period: 60,
              stat: "Sum",
            },
          },
          {
            height: 6,
            width: 6,
            y: 6,
            x: 0,
            type: "metric",
            properties: {
              metrics: [
                [
                  "AWS/ApiGateway",
                  "4xx",
                  "ApiId",
                  "75i8gi7flc",
                  {
                    yAxis: "right",
                  },
                ],
                [
                  ".",
                  "5xx",
                  ".",
                  ".",
                  {
                    yAxis: "right",
                  },
                ],
                [
                  ".",
                  "DataProcessed",
                  ".",
                  ".",
                  {
                    yAxis: "left",
                  },
                ],
                [
                  ".",
                  "Count",
                  ".",
                  ".",
                  {
                    label: "Count",
                    yAxis: "right",
                  },
                ],
                [
                  ".",
                  "IntegrationLatency",
                  ".",
                  ".",
                  {
                    stat: "Average",
                  },
                ],
                [
                  ".",
                  "Latency",
                  ".",
                  ".",
                  {
                    stat: "Average",
                  },
                ],
              ],
              view: "timeSeries",
              stacked: false,
              region: "us-east-1",
              period: 60,
              stat: "Sum",
              title: "API Gateway",
            },
          },
          {
            height: 6,
            width: 12,
            y: 0,
            x: 0,
            type: "metric",
            properties: {
              metrics: [
                [
                  "sam-app",
                  "ProcessedRequests",
                  "ServiceName",
                  "sam-app-SampleFunction-7LguHNIijNN9",
                  "LogGroup",
                  "sam-app-SampleFunction-7LguHNIijNN9",
                  "ServiceType",
                  "AWS::Lambda::Function",
                  "Service",
                  "Sample Service",
                  {
                    label: "Processed Requests",
                  },
                ],
              ],
              view: "timeSeries",
              stacked: false,
              title: "Business Metrics",
              region: "us-east-1",
              period: 60,
              stat: "Sum",
            },
          },
          {
            type: "alarm",
            x: 0,
            y: 12,
            width: 12,
            height: 2,
            properties: {
              title: "Application Alarms",
              alarms: [
                "arn:aws:cloudwatch:us-east-1:840541460064:alarm:sam-app-SampleFunctionErrorsAlarm-152VK254LOXW2",
                "arn:aws:cloudwatch:us-east-1:840541460064:alarm:sam-app-HttpApiErrorsAlarm-1FCVNCGFY7X81",
              ],
            },
          },
          {
            type: "log",
            x: 0,
            y: 14,
            width: 12,
            height: 6,
            properties: {
              query: `SOURCE '/aws/lambda/sam-app-SampleFunction-7LguHNIijNN9' | fields @message, ispresent(errorMessage) as errorPresent
| filter errorPresent != 0
| sort @timestamp desc
| display @message
| limit 100
`,
              region: "us-east-1",
              stacked: false,
              title: "Lambda Errors",
              view: "table",
            },
          },
        ],
      },
      DashboardName: "sam-app-Dashboard",
    }),
  },
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config }) => ({
      AlarmName: "sam-app-HttpApiErrorsAlarm-1FCVNCGFY7X81",
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:sam-app-AlarmsTopic-dHb6mAE6WUbZ`,
      ],
      MetricName: "5XXError",
      Namespace: "AWS/ApiGateway",
      Statistic: "Sum",
      Dimensions: [
        {
          Value: "75i8gi7flc",
          Name: "ApiName",
        },
      ],
      Period: 60,
      EvaluationPeriods: 1,
      Threshold: 1,
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
    }),
    dependencies: ({}) => ({
      snsTopic: "sam-app-AlarmsTopic-dHb6mAE6WUbZ",
    }),
  },
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config }) => ({
      AlarmName: "sam-app-SampleFunctionErrorsAlarm-152VK254LOXW2",
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:sam-app-AlarmsTopic-dHb6mAE6WUbZ`,
      ],
      MetricName: "Errors",
      Namespace: "AWS/Lambda",
      Statistic: "Sum",
      Dimensions: [
        {
          Value: "sam-app-SampleFunction-7LguHNIijNN9",
          Name: "FunctionName",
        },
      ],
      Period: 60,
      EvaluationPeriods: 1,
      Threshold: 1,
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
    }),
    dependencies: ({}) => ({
      snsTopic: "sam-app-AlarmsTopic-dHb6mAE6WUbZ",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/sam-app/APIAccessLogs",
      retentionInDays: 30,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-SampleFunctionRole-113ACVPJUKMC7",
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
          PolicyName: "AWSXrayWriteOnlyAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess",
        },
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
      Tags: [
        {
          Key: "Stack",
          Value: "sam-app-Function",
        },
      ],
    }),
  },
  {
    type: "Key",
    group: "KMS",
    name: "e6df1f6d-9049-4597-92d2-45991e66d43b",
    properties: ({ config }) => ({
      Description: "CMK for SNS alarms topic",
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: ["cloudwatch.amazonaws.com", "sns.amazonaws.com"],
            },
            Action: ["kms:GenerateDataKey*", "kms:Decrypt"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: "kms:*",
            Resource: "*",
          },
        ],
      },
      Tags: [
        {
          TagKey: "Stack",
          TagValue: "sam-app",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Description: "Sample handler for all API operations",
        Environment: {
          Variables: {
            AWS_EMF_NAMESPACE: "sam-app",
          },
        },
        FunctionName: "sam-app-SampleFunction-7LguHNIijNN9",
        Handler: "src/app.handler",
        Runtime: "nodejs14.x",
        Timeout: 100,
        TracingConfig: {
          Mode: "Active",
        },
      },
      Tags: {
        Stack: "sam-app-Function",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-SampleFunctionRole-113ACVPJUKMC7",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-SampleFunction-7LguHNIijNN9",
          Principal: "apigateway.amazonaws.com",
          StatementId: "sam-app-SampleFunctionAllEventsPermission-9396IP9YG4A4",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "sam-app",
            path: "live.ArnV2",
          })}/*/GET/`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-SampleFunction-7LguHNIijNN9",
      apiGatewayV2Apis: ["sam-app"],
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "sam-app-AlarmsTopic-dHb6mAE6WUbZ",
    properties: ({}) => ({
      Tags: [
        {
          Key: "Stack",
          Value: "sam-app",
        },
      ],
    }),
    dependencies: ({}) => ({
      kmsKey: "e6df1f6d-9049-4597-92d2-45991e66d43b",
    }),
  },
];
