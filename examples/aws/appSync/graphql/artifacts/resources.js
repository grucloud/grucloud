// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.AppSync.makeGraphqlApi({
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
    }),
  });

  provider.AppSync.makeDataSource({
    name: "lambdaDatasource",
    properties: ({}) => ({
      type: "AWS_LAMBDA",
    }),
    dependencies: ({ resources }) => ({
      serviceRole:
        resources.IAM.Role[
          "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG"
        ],
      graphqlApi: resources.AppSync.GraphqlApi["cdk-notes-appsync-api"],
      lambdaFunction: resources.Lambda.Function["lambda-fns"],
    }),
  });

  provider.AppSync.makeResolver({
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "createNote",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi["cdk-notes-appsync-api"],
      dataSource: resources.AppSync.DataSource["lambdaDatasource"],
    }),
  });

  provider.AppSync.makeResolver({
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "deleteNote",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi["cdk-notes-appsync-api"],
      dataSource: resources.AppSync.DataSource["lambdaDatasource"],
    }),
  });

  provider.AppSync.makeResolver({
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "updateNote",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi["cdk-notes-appsync-api"],
      dataSource: resources.AppSync.DataSource["lambdaDatasource"],
    }),
  });

  provider.AppSync.makeResolver({
    properties: ({}) => ({
      typeName: "Query",
      fieldName: "getNoteById",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi["cdk-notes-appsync-api"],
      dataSource: resources.AppSync.DataSource["lambdaDatasource"],
    }),
  });

  provider.AppSync.makeResolver({
    properties: ({}) => ({
      typeName: "Query",
      fieldName: "listNotes",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi["cdk-notes-appsync-api"],
      dataSource: resources.AppSync.DataSource["lambdaDatasource"],
    }),
  });

  provider.DynamoDB.makeTable({
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
  });

  provider.IAM.makeRole({
    name: "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG",
    properties: ({ config }) => ({
      Path: "/",
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
  });

  provider.IAM.makeRole({
    name: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV",
    properties: ({ config }) => ({
      Path: "/",
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
    }),
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy["AWSLambdaBasicExecutionRole"]],
    }),
  });

  provider.IAM.usePolicy({
    name: "AWSLambdaBasicExecutionRole",
    properties: ({}) => ({
      Arn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    }),
  });

  provider.Lambda.makeFunction({
    name: "lambda-fns",
    properties: ({}) => ({
      Handler: "main.handler",
      PackageType: "Zip",
      Runtime: "nodejs12.x",
      Description: "",
      Timeout: 3,
      MemorySize: 1024,
      Environment: {
        Variables: {
          NOTES_TABLE: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R",
        },
      },
    }),
    dependencies: ({ resources }) => ({
      role: resources.IAM.Role[
        "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV"
      ],
    }),
  });
};

exports.createResources = createResources;
