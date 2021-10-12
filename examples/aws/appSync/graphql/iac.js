// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.IAM.usePolicy({
    name: "AWSLambdaBasicExecutionRole",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
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
      policies: [resources.IAM.Policy.awsLambdaBasicExecutionRole],
    }),
  });

  provider.DynamoDB.makeTable({
    name: "AppsyncCdkAppStack-CDKNotesTable254A7FD1-1K1O8M7V6LS1R",
    properties: ({ config }) => ({
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

  provider.AppSync.makeGraphqlApi({
    name: "cdk-notes-appsync-api",
    properties: ({ config }) => ({
      authenticationType: "API_KEY",
      xrayEnabled: true,
      schemaFile: "cdk-notes-appsync-api.graphql",
    }),
  });

  provider.AppSync.makeApiKey({
    name: "da2-ox7s347pm5fopeyrnnvx7vyox4",
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
    }),
  });

  provider.AppSync.makeResolver({
    name: "Mutation-createNote",
    properties: ({ config }) => ({
      typeName: "Mutation",
      fieldName: "createNote",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
      dataSource: resources.AppSync.DataSource.lambdaDatasource,
    }),
  });

  provider.AppSync.makeResolver({
    name: "Mutation-deleteNote",
    properties: ({ config }) => ({
      typeName: "Mutation",
      fieldName: "deleteNote",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
      dataSource: resources.AppSync.DataSource.lambdaDatasource,
    }),
  });

  provider.AppSync.makeResolver({
    name: "Mutation-updateNote",
    properties: ({ config }) => ({
      typeName: "Mutation",
      fieldName: "updateNote",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
      dataSource: resources.AppSync.DataSource.lambdaDatasource,
    }),
  });

  provider.AppSync.makeResolver({
    name: "Query-getNoteById",
    properties: ({ config }) => ({
      typeName: "Query",
      fieldName: "getNoteById",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
      dataSource: resources.AppSync.DataSource.lambdaDatasource,
    }),
  });

  provider.AppSync.makeResolver({
    name: "Query-listNotes",
    properties: ({ config }) => ({
      typeName: "Query",
      fieldName: "listNotes",
      kind: "UNIT",
    }),
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
      dataSource: resources.AppSync.DataSource.lambdaDatasource,
    }),
  });

  provider.AppSync.makeDataSource({
    name: "lambdaDatasource",
    properties: ({ config }) => ({
      type: "AWS_LAMBDA",
    }),
    dependencies: ({ resources }) => ({
      serviceRole:
        resources.IAM.Role
          .appsyncCdkAppStackApilambdaDatasourceServiceRole2_1Bx1Mto4H3Kag,
      graphqlApi: resources.AppSync.GraphqlApi.cdkNotesAppsyncApi,
      lambdaFunction: resources.Lambda.Function.lambdaFns,
    }),
  });

  provider.Lambda.makeFunction({
    name: "lambda-fns",
    properties: ({ config }) => ({
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
      role: resources.IAM.Role
        .appsyncCdkAppStackAppSyncNotesHandlerServiceRole3V8Hwdriu57Tv,
    }),
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};
