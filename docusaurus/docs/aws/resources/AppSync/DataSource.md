---
id: DataSource
title: DataSource
---

Manages an [AppSync DataSource](https://console.aws.amazon.com/appsync/home?#/apis).

## Sample code

```js
provider.AppSync.makeDataSource({
  name: "lambdaDatasource",
  properties: ({}) => ({
    type: "AWS_LAMBDA",
  }),
  dependencies: () => ({
    serviceRole:
      "AppsyncCdkAppStack-ApilambdaDatasourceServiceRole2-1BX1MTO4H3KAG",
    graphqlApi: "cdk-notes-appsync-api",
    lambdaFunction: "lambda-fns",
  }),
});
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
