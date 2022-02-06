---
id: Deployment
title: Deployment
---

Manages an [Api Gateway V2 Deployment](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.ApiGatewayV2.makeApi({
  name: "my-api",
});

provider.ApiGatewayV2.makeStage({
  name: "my-api-stage-dev",
  dependencies: { api: "my-api" },
});

provider.ApiGatewayV2.makeDeployment({
  name: "my-api-deployment",
  dependencies: { api: "my-api", stage: "my-api-stage-dev" },
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDeployment-property)

## Dependencies

- [API](./Api.md)
- [Stage](./Stage.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Deployments can be filtered with the _Deployment_ type:

```sh
gc l -t Deployment
```

```txt

```
