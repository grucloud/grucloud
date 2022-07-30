---
id: GraphqlApi
title: GraphqlApi
---

Manages an [AppSync GraphqlApi](https://console.aws.amazon.com/appsync/home?#/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({}) => ({
      name: "cdk-notes-appsync-api",
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
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appsync/interfaces/creategraphqlapicommandinput.html)

## Used By

- [Resolver](./Resolver.md)
- [Data Source](./DataSource.md)
- [CloudWatch MetricAlarm](../CloudWatch/MetricAlarm.md)
- [WAFv2 WebACLAssociation](../WAFv2/WebACLAssociation.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql)
- [serverless-patterns appsync-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/appsync-eventbridge)
- [serverless-patterns appsync-sqs](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/appsync-sqs)
- [serverless-patterns cdk-lambda-appsync](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cdk-lambda-appsync)
- [wafv2-graphql](https://github.com/grucloud/grucloud/tree/main/examples/aws/WAFv2/wafv2-graphql)

## List

The grpahql api can be filtered with the _GraphqlApi_ type:

```sh
gc l -t GraphqlApi
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 AppSync::GraphqlApi from aws                                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: cdk-notes-appsync-api                                                       │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   name: cdk-notes-appsync-api                                                     │
│   apiId: memv4evddfe6lotdew4gewoyzm                                               │
│   authenticationType: API_KEY                                                     │
│   arn: arn:aws:appsync:eu-west-2:840541460064:apis/memv4evddfe6lotdew4gewoyzm     │
│   uris:                                                                           │
│     REALTIME: wss://f3zefikzkfgx3n3tzaj7wcr2aq.appsync-realtime-api.eu-west-2.am… │
│     GRAPHQL: https://f3zefikzkfgx3n3tzaj7wcr2aq.appsync-api.eu-west-2.amazonaws.… │
│   tags:                                                                           │
│     gc-managed-by: grucloud                                                       │
│     gc-project-name: aws-appsync-graphql                                          │
│     gc-data-source-lambdaDatasource: lambdaDatasource                             │
│     gc-stage: dev                                                                 │
│     gc-created-by-provider: aws                                                   │
│     Name: cdk-notes-appsync-api                                                   │
│   xrayEnabled: true                                                               │
│   wafWebAclArn: null                                                              │
│   schema: schema {                                                                │
│   query: Query                                                                    │
│   mutation: Mutation                                                              │
│   subscription: Subscription                                                      │
│ }                                                                                 │
│                                                                                   │
│ type Mutation {                                                                   │
│   createNote(note: NoteInput!): Note                                              │
│   deleteNote(noteId: String!): String                                             │
│   updateNote(note: UpdateNoteInput!): Note                                        │
│ }                                                                                 │
│                                                                                   │
│ type Note {                                                                       │
│   completed: Boolean!                                                             │
│   id: ID!                                                                         │
│   name: String!                                                                   │
│   title: String                                                                   │
│ }                                                                                 │
│                                                                                   │
│ type Query {                                                                      │
│   getNoteById(noteId: String!): Note                                              │
│   listNotes: [Note]                                                               │
│ }                                                                                 │
│                                                                                   │
│ type Subscription {                                                               │
│   onCreateNote: Note @aws_subscribe(mutations : ["createNote"])                   │
│   onDeleteNote: String @aws_subscribe(mutations : ["deleteNote"])                 │
│   onUpdateNote: Note @aws_subscribe(mutations : ["updateNote"])                   │
│ }                                                                                 │
│                                                                                   │
│ input NoteInput {                                                                 │
│   completed: Boolean!                                                             │
│   id: ID!                                                                         │
│   name: String!                                                                   │
│ }                                                                                 │
│                                                                                   │
│ input UpdateNoteInput {                                                           │
│   completed: Boolean                                                              │
│   id: ID!                                                                         │
│   name: String                                                                    │
│ }                                                                                 │
│                                                                                   │
│   apiKeys:                                                                        │
│     - id: da2-xohuctlwfnhsxeu5gesxqkfl7e                                          │
│       description: Graphql Api Keys                                               │
│       expires: 1635004800                                                         │
│       deletes: 1640188800                                                         │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├─────────────────────┬────────────────────────────────────────────────────────────┤
│ AppSync::GraphqlApi │ cdk-notes-appsync-api                                      │
└─────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t GraphqlApi" executed in 5s
```
