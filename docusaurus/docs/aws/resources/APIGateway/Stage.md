---
id: Stage
title: Stage
---

Manages an [API Gateway Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.APIGateway.makeRestApi({
  name: "PetStore",
  properties: ({ config }) => ({
    apiKeySource: "HEADER",
    endpointConfiguration: {
      types: ["REGIONAL"],
    },
    schemaFile: "PetStore.swagger.json",
    deployment: {
      stageName: "dev",
    },
  }),
});

provider.APIGateway.makeStage({
  name: "dev",
  properties: ({ config }) => ({
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
        unauthorizedCacheControlHeaderStrategy: "SUCCEED_WITH_RESPONSE_HEADER",
      },
    },
    cacheClusterEnabled: false,
    cacheClusterSize: "0.5",
    tracingEnabled: false,
  }),
  dependencies: ({ resources }) => ({
    restApi: resources.APIGateway.RestApi.petStore,
  }),
});
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
