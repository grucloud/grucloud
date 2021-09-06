---
id: ApiGatewayV2Stage
title: Stage
---

Manages an [Api Gateway V2 Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const api = provider.ApiGatewayV2.makeApi({
  name: "my-api",
  properties: () => ({}),
});

const stage = provider.ApiGatewayV2.makeStage({
  name: "my-api-stage-dev",
  dependencies: { api },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createStage-property)

## Dependencies

- [API](./ApiGatewayV2Api)

## Used By

- [ApiMapping](./ApiGatewayV2ApiMapping)
- [Deployment](./ApiGatewayV2Deployment)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Stages can be filtered with the _Stage_ type:

```sh
gc l -t Stage
```

```txt

```
