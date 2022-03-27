// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "GraphqlApi",
    group: "AppSync",
    name: "cdk-notes-appsync-api",
    properties: ({}) => ({
      authenticationType: "API_KEY",
      xrayEnabled: true,
      apiKeys: [
        {
          description: "Graphql Api Keys",
        },
      ],
      schemaFile: "cdk-notes-appsync-api.graphql",
      tags: {
        mykey: "myvalue",
      },
    }),
  },
  {
    type: "DataSource",
    group: "AppSync",
    name: "lambdaDatasource",
    properties: ({}) => ({
      type: "AWS_LAMBDA",
    }),
    dependencies: () => ({
      graphqlApi: "cdk-notes-appsync-api",
      serviceRole:
        "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG",
      lambdaFunction: "lambda-fns",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "createNote",
      kind: "UNIT",
    }),
    dependencies: () => ({
      graphqlApi: "cdk-notes-appsync-api",
      dataSource: "lambdaDatasource",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "deleteNote",
      kind: "UNIT",
    }),
    dependencies: () => ({
      graphqlApi: "cdk-notes-appsync-api",
      dataSource: "lambdaDatasource",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "updateNote",
      kind: "UNIT",
    }),
    dependencies: () => ({
      graphqlApi: "cdk-notes-appsync-api",
      dataSource: "lambdaDatasource",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Query",
      fieldName: "getNoteById",
      kind: "UNIT",
    }),
    dependencies: () => ({
      graphqlApi: "cdk-notes-appsync-api",
      dataSource: "lambdaDatasource",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Query",
      fieldName: "listNotes",
      kind: "UNIT",
    }),
    dependencies: () => ({
      graphqlApi: "cdk-notes-appsync-api",
      dataSource: "lambdaDatasource",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    name: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R",
    properties: ({}) => ({
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appsync.amazonaws.com",
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
                }:${config.accountId()}:function:lambda-fns`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ApilambdaDatasourceServiceRoleDefaultPolicy3A97E34D",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV",
    properties: ({ config }) => ({
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
            Version: "2012-10-17",
            Statement: [
              {
                Action: "dynamodb:*",
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AppSyncNotesHandlerServiceRoleDefaultPolicy12C70C4F",
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
    dependencies: () => ({
      table: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "lambda-fns",
    properties: ({}) => ({
      Environment: {
        Variables: {
          NOTES_TABLE: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R",
        },
      },
      Handler: "main.handler",
      MemorySize: 1024,
      PackageType: "Zip",
      Runtime: "nodejs12.x",
    }),
    dependencies: () => ({
      role: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV",
    }),
  },
];
