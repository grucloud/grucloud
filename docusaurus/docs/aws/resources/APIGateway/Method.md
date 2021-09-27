---
id: APIGatewayMethod
title: Integration
---

Manages an [API Gateway Method](https://console.aws.amazon.com/apigateway/main/apis).

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

const authorizer = provider.APIGateway.makeAuthorizer({
  name: "my-authorizer-stage-dev",
  dependencies: { restApi },
  properties: () => ({}),
});

const methodGet = provider.APIGateway.makeMethod({
  name: "method-get",
  dependencies: {
    resource: resourceGet,
    authorizer,
  },
  properties: () => ({
    httpMethod: "GET",
    authorizationType: "NONE",
    type: "AWS_PROXY",
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#putMethod-property)

## Dependencies

- [RestAPI](./APIGatewayRestApi)
- [Resource](./APIGatewayResource)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Integrations can be filtered with the _Integration_ type:

```sh
gc l -t Method
```

```txt

```
