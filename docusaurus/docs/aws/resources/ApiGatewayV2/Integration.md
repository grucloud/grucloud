---
id: ApiGatewayV2Integration
title: Integration
---

Manages an [Api Gateway V2 Integration](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const api = provider.ApiGatewayV2.makeApi({
  name: "my-api",
  properties: () => ({}),
});

const integration = provider.ApiGatewayV2.makeIntegration({
  name: "integration-lambda",
  dependencies: { api, lambdaFunction: lambdaFunction },
  properties: () => ({
    IntegrationMethod: "POST",
    IntegrationType: "AWS_PROXY",
    PayloadFormatVersion: "2.0",
  }),
});
```

## Properties sdsdsd

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegration-property)

## Dependencies

- [API](./API)
- [Integration](./Integration)

## Used By

- [Route](./Route)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Integrations can be filtered with the _Integration_ type:

```sh
gc l -t Integration
```

```txt

```
