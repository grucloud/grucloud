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

const resourceGet = provider.APIGateway.makeResource({
  name: "resource-get",
  dependencies: { restApi },
  properties: () => ({ pathPart: "/customers" }),
});

const methodGet = provider.APIGateway.makeMethod({
  name: "method-get",
  dependencies: {
    restApi,
    resource: resourceGet,
  },
  properties: () => ({
    httpMethod: "GET",
    type: "AWS_PROXY",
  }),
});

const integration = provider.APIGateway.makeIntegration({
  name: "integration-lambda",
  dependencies: {
    method: methodGet,
    lambdaFunction: lambdaFunction,
  },
  properties: () => ({
    type: "AWS_PROXY",
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#putIntegration-property)

## Dependencies

- [RestAPI](./APIGatewayRestApi)
- [Resource](./APIGatewayResource)
- [Method](./APIGatewayMethod)
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
