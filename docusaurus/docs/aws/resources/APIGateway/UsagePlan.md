---
id: UsagePlan
title: Usage Plan
---

Manages an [API Gateway Usage Plan](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "UsagePlan",
    group: "APIGateway",
    properties: ({ getId }) => ({
      apiStages: [
        {
          apiId: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "APIGW DynamoDB Serverless Pattern Demo",
          })}`,
          stage: "v1",
        },
      ],
      name: "apigw-dynamodb-terraform-usage-plan",
      quota: {
        limit: 1000,
        offset: 0,
        period: "MONTH",
      },
      throttle: {
        burstLimit: 20,
        rateLimit: 100,
      },
    }),
    dependencies: ({}) => ({
      stages: ["v1"],
    }),
  },
];
```

## Properties

- [CreateUsagePlanCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createusageplancommandinput.html)

## Dependencies

- [RestApi](./RestApi.md)
- [Stage](./Stage.md)

## Full Examples

- [apigw-rest-api-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-dynamodb-terraform)

## List

The integrations can be filtered with the _APIGateway::UsagePlan_ type:

```sh
gc l -t APIGateway::UsagePlan
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 APIGateway::UsagePlan from aws                                                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: apigw-dynamodb-terraform-usage-plan                                         │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   apiStages:                                                                      │
│     - apiId: 3wnu55wdxi                                                           │
│       stage: v1                                                                   │
│   id: muuntv                                                                      │
│   name: apigw-dynamodb-terraform-usage-plan                                       │
│   quota:                                                                          │
│     limit: 1000                                                                   │
│     offset: 0                                                                     │
│     period: MONTH                                                                 │
│   tags:                                                                           │
│     Name: apigw-dynamodb-terraform-usage-plan                                     │
│     gc-created-by-provider: aws                                                   │
│     gc-managed-by: grucloud                                                       │
│     gc-project-name: apigw-dynamodb-terraform                                     │
│     gc-stage: dev                                                                 │
│   throttle:                                                                       │
│     burstLimit: 20                                                                │
│     rateLimit: 100                                                                │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├───────────────────────┬──────────────────────────────────────────────────────────┤
│ APIGateway::UsagePlan │ apigw-dynamodb-terraform-usage-plan                      │
└───────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t UsagePlan" executed in 4s, 115 MB
```
