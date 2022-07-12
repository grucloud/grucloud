---
id: Stage
title: Stage
---

Manages an [API Gateway Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    name: "PetStore",
    properties: ({}) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      schemaFile: "PetStore.oas30.json",
      deployment: {
        stageName: "dev",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    name: "dev",
    properties: ({}) => ({
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
    name: "prod",
    properties: ({}) => ({
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

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda)

## List

The Stages can be filtered with the _Stage_ type:

```sh
gc l -t Stage
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────┐
│ 2 APIGateway::Stage from aws                               │
├────────────────────────────────────────────────────────────┤
│ name: dev                                                  │
│ managedByUs: Yes                                           │
│ live:                                                      │
│   cacheClusterEnabled: false                               │
│   cacheClusterSize: 0.5                                    │
│   cacheClusterStatus: NOT_AVAILABLE                        │
│   createdDate: 2022-03-10T02:54:35.000Z                    │
│   deploymentId: 2f1hv2                                     │
│   description: dev                                         │
│   lastUpdatedDate: 2022-03-10T02:54:36.000Z                │
│   methodSettings:                                          │
│     */*:                                                   │
│       cacheDataEncrypted: false                            │
│       cacheTtlInSeconds: 300                               │
│       cachingEnabled: false                                │
│       dataTraceEnabled: false                              │
│       metricsEnabled: false                                │
│       requireAuthorizationForCacheControl: true            │
│       throttlingBurstLimit: 5000                           │
│       throttlingRateLimit: 10000                           │
│       unauthorizedCacheControlHeaderStrategy: SUCCEED_WIT… │
│   stageName: dev                                           │
│   tags:                                                    │
│     Name: dev                                              │
│     gc-created-by-provider: aws                            │
│     gc-managed-by: grucloud                                │
│     gc-project-name: @grucloud/example-aws-api-gateway-re… │
│     gc-stage: dev                                          │
│     mykey1: myvalue1                                       │
│   tracingEnabled: false                                    │
│   restApiId: dfc2hu0zti                                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ name: prod                                                 │
│ managedByUs: Yes                                           │
│ live:                                                      │
│   cacheClusterEnabled: false                               │
│   cacheClusterStatus: NOT_AVAILABLE                        │
│   createdDate: 2022-03-10T02:54:35.000Z                    │
│   deploymentId: 2f1hv2                                     │
│   description: prod                                        │
│   lastUpdatedDate: 2022-03-10T02:54:36.000Z                │
│   methodSettings:                                          │
│   stageName: prod                                          │
│   tags:                                                    │
│     Name: prod                                             │
│     gc-created-by-provider: aws                            │
│     gc-managed-by: grucloud                                │
│     gc-project-name: @grucloud/example-aws-api-gateway-re… │
│     gc-stage: dev                                          │
│   tracingEnabled: false                                    │
│   restApiId: dfc2hu0zti                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────┐
│ aws                                                       │
├───────────────────┬───────────────────────────────────────┤
│ APIGateway::Stage │ dev                                   │
│                   │ prod                                  │
└───────────────────┴───────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t APIGateway::Stage" executed in 5s, 136 MB
```
