---
id: ApiGatewayV2Route
title: Route
---

Manages an [Api Gateway V2 Route](https://console.aws.amazon.com/apigateway/main/apis).

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

provider.ApiGatewayV2.makeRoute({
  name: config.apiGatewayV2.route.name,
  dependencies: { api, integration },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRoute-property)

## Dependencies

- [API](./ApiGatewayV2Api)
- [Integration](./ApiGatewayV2Integration)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Routes can be filtered with the _Route_ type:

```sh
gc l -t Route
```

```txt

```
