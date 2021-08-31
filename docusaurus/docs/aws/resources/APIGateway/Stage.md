---
id: APIGatewayStage
title: Stage
---

Manages an [API Gateway Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.APIGateway.makeRestApi({
  name: "myRestApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});

const stage = provider.APIGateway.makeStage({
  name: "my-api-stage-dev",
  dependencies: { restApi },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createStage-property)

## Dependencies

- [RestAPI](./RestAPI)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Stages can be filtered with the _Stage_ type:

```sh
gc l -t Stage
```

```txt

```
