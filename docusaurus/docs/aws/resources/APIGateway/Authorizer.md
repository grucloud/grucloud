---
id: Authorizer
title: Authorizer
---

Manages an [API Gateway Authorizer](https://console.aws.amazon.com/apigateway/main/apis).

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
    type: "Authorizer",
    group: "APIGateway",
    name: "my-authorizer-stage-dev",
    dependencies: () => ({
      restApi: "PetStore",
    }),
    properties: ({}) => ({}),
  },
];
```

## Properties

- [CreateAuthorizerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createauthorizercommandinput.html)

## Dependencies

- [RestAPI](./RestApi.md)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda)

## List

The authorizers can be filtered with the _Authorizer_ type:

```sh
gc l -t Authorizer
```

```txt

```
