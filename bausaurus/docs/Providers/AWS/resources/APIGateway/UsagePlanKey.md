---
id: UsagePlanKey
title: Usage Plan Key
---

Manages an [API Gateway Usage Plan](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "UsagePlanKey",
    group: "APIGateway",
    properties: ({}) => ({
      name: "apigw-dynamodb-terraform-api-key",
    }),
    dependencies: ({}) => ({
      usagePlan: "apigw-dynamodb-terraform-usage-plan",
      apiKey: "apigw-dynamodb-terraform-api-key",
    }),
  },
];
```

## Properties

- [CreateUsagePlanKeyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createusageplankeycommandinput.html)

## Dependencies

- [Usage Plan](./UsagePlan.md)
- [Api Key](./ApiKey.md)

## Full Examples

- [apigw-rest-api-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-dynamodb-terraform)

## List

The user plan keys can be filtered with the _APIGateway::UsagePlanKey_ type:

```sh
gc l -t APIGateway::UsagePlanKey
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 APIGateway::UsagePlanKey from aws                                                   │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ name: apigw-dynamodb-terraform-api-key                                                │
│ managedByUs: Yes                                                                      │
│ live:                                                                                 │
│   keyId: jpbzsnsj3g                                                                   │
│   keyType: API_KEY                                                                    │
│   id: MdD7yuZNMRtDSMQ8zdaT2jfd4MdPaXY7gsA4MyFd                                        │
│   name: apigw-dynamodb-terraform-api-key                                              │
│   usagePlanId: 51i8nl                                                                 │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├──────────────────────────┬───────────────────────────────────────────────────────────┤
│ APIGateway::UsagePlanKey │ apigw-dynamodb-terraform-api-key                          │
└──────────────────────────┴───────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t APIGateway::UsagePlanKey" executed in 7s, 109 MB
```
