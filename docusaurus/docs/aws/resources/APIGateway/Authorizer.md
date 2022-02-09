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
