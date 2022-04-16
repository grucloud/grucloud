// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-PutMetricFunctionRole-1KSH0UBOZBZUW",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: ["cloudwatch:PutMetricData"],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "PutMetricFunctionRolePolicy0",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
      Tags: [
        {
          Key: "lambda:createdBy",
          Value: "SAM",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "sam-app-PutMetricFunction-0NnvltwaAkR3",
    properties: ({}) => ({
      Configuration: {
        Handler: "app.lambdaHandler",
        Runtime: "nodejs14.x",
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: () => ({
      role: "sam-app-PutMetricFunctionRole-1KSH0UBOZBZUW",
    }),
  },
];
