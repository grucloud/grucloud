---
id: Stage
title: Stage
---

Manages an [API Gateway Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "dev",
      description: "dev",
      methodSettings: {
        "*/*": {
          metricsEnabled: false,
          dataTraceEnabled: false,
          throttlingBurstLimit: 5000,
          throttlingRateLimit: 10000,
          cachingEnabled: false,
          cacheTtlInSeconds: 300,
          cacheDataEncrypted: false,
          requireAuthorizationForCacheControl: true,
          unauthorizedCacheControlHeaderStrategy:
            "SUCCEED_WITH_RESPONSE_HEADER",
        },
      },
      cacheClusterEnabled: false,
      cacheClusterSize: "0.5",
      tracingEnabled: false,
    }),
    dependencies: () => ({
      restApi: "PetStore",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "prod",
      description: "prod",
      cacheClusterEnabled: false,
      tracingEnabled: false,
    }),
    dependencies: () => ({
      restApi: "PetStore",
    }),
  },
];
```

## Properties

- [CreateStageCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createstagecommandinput.html)

## Dependencies

- [RestAPI](./RestApi.md)

## Used By

- [WAFv2 WebACLAssociation](../WAFv2/WebACLAssociation.md)
- [Usage Plan](./UsagePlan.md)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda)
- [serverless-patterns apigw-dynamodb-terraform](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-dynamodb-terraform)
- [serverless-patterns rest-api-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-rest-api-dynamodb)
- [serverless-patterns apigw-rest-api-eventbridge-terraform](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-rest-api-eventbridge-terraform)
- [serverless-patterns sfn-apigw](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-apigw)
- [wafv2-apigateway-rest](https://github.com/grucloud/grucloud/tree/main/examples/aws/WAFv2/wafv2-apigateway-rest)

## List

The Stages can be filtered with the _APIGateway::Stage_ type:

```sh
gc l -t APIGateway::Stage
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 APIGateway::Stage from aws                                                                 │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: PetStore::dev                                                                          │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   cacheClusterEnabled: false                                                                 │
│   cacheClusterSize: 0.5                                                                      │
│   cacheClusterStatus: NOT_AVAILABLE                                                          │
│   createdDate: 2022-08-05T11:22:12.000Z                                                      │
│   deploymentId: 7bvcv4                                                                       │
│   description: dev                                                                           │
│   lastUpdatedDate: 2022-08-05T11:22:13.000Z                                                  │
│   methodSettings:                                                                            │
│     */*:                                                                                     │
│       cacheDataEncrypted: false                                                              │
│       cacheTtlInSeconds: 300                                                                 │
│       cachingEnabled: false                                                                  │
│       dataTraceEnabled: false                                                                │
│       metricsEnabled: false                                                                  │
│       requireAuthorizationForCacheControl: true                                              │
│       throttlingBurstLimit: 5000                                                             │
│       throttlingRateLimit: 10000                                                             │
│       unauthorizedCacheControlHeaderStrategy: SUCCEED_WITH_RESPONSE_HEADER                   │
│   stageName: dev                                                                             │
│   tags:                                                                                      │
│     gc-created-by-provider: aws                                                              │
│     gc-managed-by: grucloud                                                                  │
│     gc-project-name: @grucloud/example-aws-api-gateway-restapi-lambda                        │
│     gc-stage: dev                                                                            │
│     mykey: myvalue3                                                                          │
│   tracingEnabled: false                                                                      │
│   restApiId: q5yambpydj                                                                      │
│   restApiName: PetStore                                                                      │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: PetStore::prod                                                                         │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   cacheClusterEnabled: false                                                                 │
│   cacheClusterStatus: NOT_AVAILABLE                                                          │
│   createdDate: 2022-08-05T11:22:12.000Z                                                      │
│   deploymentId: 7bvcv4                                                                       │
│   description: prod                                                                          │
│   lastUpdatedDate: 2022-08-05T11:22:13.000Z                                                  │
│   methodSettings:                                                                            │
│   stageName: prod                                                                            │
│   tags:                                                                                      │
│     gc-created-by-provider: aws                                                              │
│     gc-managed-by: grucloud                                                                  │
│     gc-project-name: @grucloud/example-aws-api-gateway-restapi-lambda                        │
│     gc-stage: dev                                                                            │
│   tracingEnabled: false                                                                      │
│   restApiId: q5yambpydj                                                                      │
│   restApiName: PetStore                                                                      │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├───────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ APIGateway::Stage │ PetStore::dev                                                           │
│                   │ PetStore::prod                                                          │
└───────────────────┴─────────────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t APIGateway::Stage" executed in 8s, 100 MB
```
