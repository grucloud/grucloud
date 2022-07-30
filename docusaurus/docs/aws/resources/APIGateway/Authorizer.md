---
id: Authorizer
title: Authorizer
---

Manages an [API Gateway Authorizer](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Authorizer",
    group: "APIGateway",
    dependencies: () => ({
      restApi: "PetStore",
    }),
    properties: ({}) => ({ name: "my-authorizer-stage-dev" }),
  },
];
```

## Properties

- [CreateAuthorizerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createauthorizercommandinput.html)

## Dependencies

- [RestAPI](./RestApi.md)

## Full Examples

## List

The authorizers can be filtered with the _Authorizer_ type:

```sh
gc l -t Authorizer
```

```txt

```
