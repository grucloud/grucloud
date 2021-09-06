---
id: APIGatewayDeployment
title: Deployment
---

Manages an [API Gateway Deployment](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.APIGateway.makeRestApi({
  name: "myRestApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});

const stage = provider.APIGateway.makeStage({
  name: "my-api-stage-dev",
  dependencies: { restApi },
  properties: () => ({}),
});

const deployment = provider.APIGateway.makeDeployment({
  name: "my-api-deployment",
  dependencies: { restApi, stage },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDeployment-property)

## Dependencies

- [RestAPI](./APIGatewayRestApi)
- [Stage](./APIGatewayStage)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The Deployments can be filtered with the _Deployment_ type:

```sh
gc l -t Deployment
```

```txt

```
