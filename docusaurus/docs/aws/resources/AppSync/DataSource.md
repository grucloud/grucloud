---
id: DataSource
title: DataSource
---

Manages an [AppSync DataSource](https://console.aws.amazon.com/appsync/home?#/apis).

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

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appsync/interfaces/createDataSourcecommandinput.html)

## Dependencies

- [GraphqlApi](./GraphqlApi.md)
- [Iam Role](../IAM/Role.md)
- [Lambda Function](../Lambda/Function.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/appSync/graphql)

## List

The DataSources can be filtered with the _DataSource_ type:

```sh
gc l -t DataSource
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 AppSync::DataSource from aws                                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: lambdaDatasource                                                            │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   dataSourceArn: arn:aws:appsync:eu-west-2:840541460064:apis/2lufvsvnrrhajlz2suw… │
│   name: lambdaDatasource                                                          │
│   description: null                                                               │
│   type: AWS_LAMBDA                                                                │
│   serviceRoleArn: arn:aws:iam::840541460064:role/AppsyncCdkAppStack-ApilambdaDat… │
│   lambdaConfig:                                                                   │
│     lambdaFunctionArn: arn:aws:lambda:eu-west-2:840541460064:function:lambda-fns  │
│   apiId: 2lufvsvnrrhajlz2suwx4nt6vy                                               │
│   tags:                                                                           │
│     gc-managed-by: grucloud                                                       │
│     gc-project-name: aws-appsync-graphql                                          │
│     gc-stage: dev                                                                 │
│     gc-created-by-provider: aws                                                   │
│     Name: cdk-notes-appsync-api                                                   │
│     name: lambdaDatasource                                                        │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├─────────────────────┬────────────────────────────────────────────────────────────┤
│ AppSync::DataSource │ lambdaDatasource                                           │
└─────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t DataSource" executed in 13s
```
