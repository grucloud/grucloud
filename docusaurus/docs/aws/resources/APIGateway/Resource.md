---
id: APIGatewayResource
title: Resource
---

Manages an [API Gateway Resource](https://console.aws.amazon.com/apigateway/main/apis).

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
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createResource-property)

## Dependencies

- [RestAPI](./RestAPI)

## Used By

- [Integration](./Integration)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Resources can be filtered with the _Resource_ type:

```sh
gc l -t Resource
```

```txt

```
