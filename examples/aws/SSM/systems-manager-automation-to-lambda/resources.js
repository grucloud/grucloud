// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-DynamoDBTable-1JJ3XXB72MCD7",
      AttributeDefinitions: [
        {
          AttributeName: "Album",
          AttributeType: "S",
        },
        {
          AttributeName: "Artist",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "Album",
          KeyType: "HASH",
        },
        {
          AttributeName: "Artist",
          KeyType: "RANGE",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      Tags: [
        {
          Key: "namespace",
          Value: "development",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-AutomationExecutionRole-APELH07JEFSN",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ssm.amazonaws.com",
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
                Action: "lambda:InvokeFunction",
                Resource: `arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-LambdaFunction-SzMn1A4Jbksd`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "automation-invoke-lambda-execution",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-LambdaFunctionRole-1FRJGZ3ABRF6R",
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
                Action: ["DynamoDB:UpdateTable", "DynamoDB:PutItem"],
                Resource: `arn:aws:dynamodb:${
                  config.region
                }:${config.accountId()}:table/sam-app-DynamoDBTable-1JJ3XXB72MCD7`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaFunctionRolePolicy0",
        },
      ],
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
        FunctionName: "sam-app-LambdaFunction-SzMn1A4Jbksd",
        Handler: "app.handler",
        Runtime: "python3.7",
        Timeout: 60,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-LambdaFunctionRole-1FRJGZ3ABRF6R",
    }),
  },
  {
    type: "Document",
    group: "SSM",
    properties: ({}) => ({
      Content: {
        schemaVersion: "0.3",
        description:
          "Automation document for the invoking a lambda function v3",
        parameters: {
          SortKeyInput: {
            type: "String",
          },
          PartitonKeyInput: {
            type: "String",
          },
          DocumentInputTableName: {
            type: "String",
          },
        },
        mainSteps: [
          {
            inputs: {
              FunctionName: "sam-app-LambdaFunction-SzMn1A4Jbksd",
              Payload: `{
 "ssm_automation_parameters":
   {
     "table_name": "{{DocumentInputTableName}}",
     "partition_key_input": "{{PartitonKeyInput}}",
     "sort_key_input":"{{SortKeyInput}}"
   }
}
`,
            },
            name: "lambda_invoke",
            action: "aws:invokeLambdaFunction",
            onFailure: "Abort",
          },
        ],
      },
      DocumentType: "Automation",
      Name: "sam-app-SsmAutomationDocument-tWpS8MDWk4RI",
      Parameters: [
        {
          Name: "SortKeyInput",
          Type: "String",
        },
        {
          Name: "PartitonKeyInput",
          Type: "String",
        },
        {
          Name: "DocumentInputTableName",
          Type: "String",
        },
      ],
      PlatformTypes: ["Windows", "Linux", "MacOS"],
    }),
  },
];
