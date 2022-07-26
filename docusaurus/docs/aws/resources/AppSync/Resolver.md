---
id: Resolver
title: Resolver
---

Manages an [AppSync Resolver](https://console.aws.amazon.com/appsync/home?#/apis).

## Sample code

```js
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
    type: "Role",
    group: "IAM",
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
  },
  {
    type: "Role",
    group: "IAM",
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
    dependencies: () => ({
      policies: ["AWSLambdaBasicExecutionRole"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "AWSLambdaBasicExecutionRole",
    readOnly: true,
    properties: ({}) => ({
      Arn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
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
    dependencies: () => ({
      role: "AppsyncCdkAppStack-AppSyncNotesHandlerServiceRole3-V8HWDRIU57TV",
    }),
  },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appsync/interfaces/createresolvercommandinput.html)

## Dependencies

- [GraphqlApi](./GraphqlApi.md)
- [DataSource](./DataSource.md)
- [Type](./Type.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql)

## List

The resolvers can be filtered with the _Resolver_ type:

```sh
gc l -t Resolver
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 5/5
┌───────────────────────────────────────────────────────────────────────────┐
│ 5 AppSync::Resolver from aws                                              │
├───────────────────────────────────────────────────────────────────────────┤
│ name: Mutation-createMyModelType                                          │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   typeName: Mutation                                                      │
│   fieldName: createMyModelType                                            │
│   dataSourceName: MyModelTypeTable                                        │
│   resolverArn: arn:aws:appsync:eu-west-2:840541460064:apis/7xsgpgf4hjef7… │
│   requestMappingTemplate: {                                               │
│   "version": "2017-02-28",                                                │
│   "operation": "PutItem",                                                 │
│   "key": {                                                                │
│     "id": $util.dynamodb.toDynamoDBJson($util.autoId()),                  │
│   },                                                                      │
│   "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),     │
│   "condition": {                                                          │
│     "expression": "attribute_not_exists(#id)",                            │
│     "expressionNames": {                                                  │
│       "#id": "id",                                                        │
│     },                                                                    │
│   },                                                                      │
│ }                                                                         │
│   responseMappingTemplate: $util.toJson($context.result)                  │
│   kind: UNIT                                                              │
│   apiId: 7xsgpgf4hjef7f5higuiifiapm                                       │
│   tags:                                                                   │
│     gc-api-key-da2-obteoqfenja6dnmmfiuhb223dq: da2-wbuvlxl5cfapbifytstbz… │
│     gc-project-name: aws-appsync-graphql                                  │
│     gc-api-key-da2-5dhrxdmt75f5naje6soej3dkja: da2-kyhuzrhyvbcadm6geay6g… │
│     gc-managed-by: grucloud                                               │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     gc-data-source-MyModelTypeTable: MyModelTypeTable                     │
│     Name: My AppSync App                                                  │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: Mutation-deleteMyModelType                                          │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   typeName: Mutation                                                      │
│   fieldName: deleteMyModelType                                            │
│   dataSourceName: MyModelTypeTable                                        │
│   resolverArn: arn:aws:appsync:eu-west-2:840541460064:apis/7xsgpgf4hjef7… │
│   requestMappingTemplate: {                                               │
│   "version": "2017-02-28",                                                │
│   "operation": "DeleteItem",                                              │
│   "key": {                                                                │
│     "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),              │
│   },                                                                      │
│ }                                                                         │
│   responseMappingTemplate: $util.toJson($context.result)                  │
│   kind: UNIT                                                              │
│   apiId: 7xsgpgf4hjef7f5higuiifiapm                                       │
│   tags:                                                                   │
│     gc-api-key-da2-obteoqfenja6dnmmfiuhb223dq: da2-wbuvlxl5cfapbifytstbz… │
│     gc-project-name: aws-appsync-graphql                                  │
│     gc-api-key-da2-5dhrxdmt75f5naje6soej3dkja: da2-kyhuzrhyvbcadm6geay6g… │
│     gc-managed-by: grucloud                                               │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     gc-data-source-MyModelTypeTable: MyModelTypeTable                     │
│     Name: My AppSync App                                                  │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
```
