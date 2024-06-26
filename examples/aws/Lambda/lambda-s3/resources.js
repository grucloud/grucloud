// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-PutObjectFunctionRole-TFR4FTCB12K2",
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
                Action: [
                  "s3:GetObject",
                  "s3:ListBucket",
                  "s3:GetBucketLocation",
                  "s3:GetObjectVersion",
                  "s3:PutObject",
                  "s3:PutObjectAcl",
                  "s3:GetLifecycleConfiguration",
                  "s3:PutLifecycleConfiguration",
                  "s3:DeleteObject",
                ],
                Effect: "Allow",
                Resource: [
                  "arn:aws:s3:::gc-destination-example",
                  "arn:aws:s3:::gc-destination-example/*",
                ],
              },
            ],
          },
          PolicyName: "PutObjectFunctionRolePolicy0",
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
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            DestinationBucketName: "gc-destination-example",
          },
        },
        FunctionName: "sam-app-PutObjectFunction-UHg0AjQBqco2",
        Handler: "app.lambda_handler",
        Runtime: "python3.8",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-PutObjectFunctionRole-TFR4FTCB12K2",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-destination-example",
    }),
  },
];
