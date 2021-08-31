---
id: ApiGatewayV2Authorizer
title: Authorizer
---

Manages an [Api Gateway V2 Authorizer](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const api = provider.ApiGatewayV2.makeApi({
  name: "my-api",
  properties: () => ({}),
});

const authorizer = provider.ApiGatewayV2.makeAuthorizer({
  name: "my-authorizer-stage-dev",
  dependencies: { api },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createAuthorizer-property)

## Dependencies

- [API](./API)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Authorizers can be filtered with the _Authorizer_ type:

```sh
gc l -t Authorizer
```

```txt

```
