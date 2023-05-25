// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-ResizeFunctionRole-172M6F9I46D0S",
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
                Resource: [
                  "arn:aws:s3:::sam-app-s3bucket-uoktptsszrdd",
                  "arn:aws:s3:::sam-app-s3bucket-uoktptsszrdd/*",
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ResizeFunctionRolePolicy0",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: "s3-object-lambda:WriteGetObjectResponse",
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ResizeFunctionRolePolicy1",
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
        FunctionName: "sam-app-ResizeFunction-NiODFBqJDB40",
        Handler: "app.handler",
        MemorySize: 2048,
        Runtime: "nodejs12.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ResizeFunctionRole-172M6F9I46D0S",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: "sam-app-s3bucket-uoktptsszrdd",
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: "*",
            },
            Action: "*",
            Resource: [
              "arn:aws:s3:::sam-app-s3bucket-uoktptsszrdd",
              "arn:aws:s3:::sam-app-s3bucket-uoktptsszrdd/*",
            ],
            Condition: {
              StringEquals: {
                "s3:DataAccessPointAccount": `${config.accountId()}`,
              },
            },
          },
        ],
      },
    }),
  },
  {
    type: "AccessPoint",
    group: "S3Control",
    properties: ({}) => ({
      Bucket: "sam-app-s3bucket-uoktptsszrdd",
      Name: "resize-ap",
      NetworkOrigin: "Internet",
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    }),
    dependencies: ({}) => ({
      s3Bucket: "sam-app-s3bucket-uoktptsszrdd",
    }),
  },
  {
    type: "ObjectLambdaAccessPoint",
    group: "S3Control",
    properties: ({ config, getId }) => ({
      Configuration: {
        AllowedFeatures: [],
        CloudWatchMetricsEnabled: false,
        SupportingAccessPoint: `arn:aws:s3:${
          config.region
        }:${config.accountId()}:accesspoint/resize-ap`,
        TransformationConfigurations: [
          {
            Actions: ["GetObject"],
            ContentTransformation: {
              AwsLambda: {
                FunctionArn: `${getId({
                  type: "Function",
                  group: "Lambda",
                  name: "sam-app-ResizeFunction-NiODFBqJDB40",
                })}`,
                FunctionPayload: "test-payload",
              },
            },
          },
        ],
      },
      Name: "resize-olap",
    }),
    dependencies: ({}) => ({
      s3AccessPoint: "resize-ap",
      lambdaFunctions: ["sam-app-ResizeFunction-NiODFBqJDB40"],
    }),
  },
];