// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "secret-rotation-role-er1abb4h",
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
      AttachedPolicies: [
        {
          PolicyName: "SecretsManagerReadWrite",
          PolicyArn: "arn:aws:iam::aws:policy/SecretsManagerReadWrite",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: [
        "AWSLambdaBasicExecutionRole-9901686a-c6a3-4b1f-a9b8-fb18725a91ae",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "AWSLambdaBasicExecutionRole-9901686a-c6a3-4b1f-a9b8-fb18725a91ae",
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
              }:${config.accountId()}:log-group:/aws/lambda/secret-rotation:*`,
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
        FunctionName: "secret-rotation",
        Handler: "index.handler",
        Runtime: "nodejs18.x",
      },
    }),
    dependencies: ({}) => ({
      role: "secret-rotation-role-er1abb4h",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({}) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "secret-rotation",
          Principal: "secretsmanager.amazonaws.com",
          StatementId: "stmt",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "secret-rotation",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "prod/myapp/db",
      SecretString: {
        password: generatePassword({ length: 32 }),
        username: "demousername",
      },
      Description: "access postgres",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "SecretRotation",
    group: "SecretsManager",
    properties: ({}) => ({
      SecretId: "prod/myapp/db",
      RotationRules: {
        Duration: "4h",
        ScheduleExpression: "rate(15 hours)",
      },
    }),
    dependencies: ({}) => ({
      secret: "prod/myapp/db",
      lambdaFunction: "secret-rotation",
    }),
  },
  {
    type: "ResourcePolicy",
    group: "SecretsManager",
    properties: ({}) => ({
      ResourcePolicy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "EnableAnotherAccountToReadTheSecret",
            Effect: "Allow",
            Principal: {
              AWS: "arn:aws:iam::548529576214:root",
            },
            Action: "secretsmanager:GetSecretValue",
            Resource: "*",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      secret: "prod/myapp/db",
    }),
  },
];