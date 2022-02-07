---
id: Resolver
title: Resolver
---

Manages an [AppSync Resolver](https://console.aws.amazon.com/appsync/home?#/apis).

## Sample code

```js
provider.AppSync.makeResolver({
  properties: ({}) => ({
    typeName: "Mutation",
    fieldName: "createNote",
    kind: "UNIT",
  }),
  dependencies: () => ({
    graphqlApi: "cdk-notes-appsync-api",
    dataSource: "lambdaDatasource",
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appsync/interfaces/createresolvercommandinput.html)

## Dependencies

- [GraphqlApi](./GraphqlApi.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/appSync/graphql)

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
