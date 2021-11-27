---
id: Authorizer
title: Authorizer
---

Manages an [API Gateway Authorizer](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.APIGateway.makeRestApi({
  name: "myRestApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});

const authorizer = provider.APIGateway.makeAuthorizer({
  name: "my-authorizer-stage-dev",
  dependencies: { restApi },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createAuthorizer-property)

## Dependencies

- [RestAPI](./RestApi.md)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Authorizers can be filtered with the _Authorizer_ type:

```sh
gc l -t Authorizer
```

```txt

```
