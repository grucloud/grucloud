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

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/modules/createstagerequest.html)

## Dependencies

- [RestAPI](./RestApi.md)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Stages can be filtered with the _Stage_ type:

```sh
gc l -t Stage
```

```txt

```
