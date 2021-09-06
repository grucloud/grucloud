---
id: APIGatewayIntegration
title: Integration
---

Manages an [API Gateway Integration](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.APIGateway.makeRestApi({
  name: "myRestApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});

const integration = provider.APIGateway.makeIntegration({
  name: "integration-lambda",
  dependencies: {
    restApi,
    resource: resourceGet,
    lambdaFunction: lambdaFunction,
  },
  properties: () => ({
    httpMethod: "GET",
    type: "AWS_PROXY",
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#putIntegration-property)

## Dependencies

- [RestAPI](./APIGatewayRestApi)
- [Resource](./APIGatewayResource)
- [Lambda Function](../Lambda/LambdaFunction)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Integrations can be filtered with the _Integration_ type:

```sh
gc l -t Integration
```

```txt

```
