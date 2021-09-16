---
id: APIGatewayModel
title: Model
---

Manages an [API Gateway Model](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.APIGateway.makeRestApi({
  name: "myRestApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});

const model = provider.APIGateway.makeModel({
  name: "my-model",
  dependencies: { restApi },
  properties: () => ({
    contentType: "",
    schema: "",
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createModel-property)

## Dependencies

- [RestAPI](./APIGatewayRestApi)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The models can be filtered with the _Model_ type:

```sh
gc l -t Model
```

```txt

```
