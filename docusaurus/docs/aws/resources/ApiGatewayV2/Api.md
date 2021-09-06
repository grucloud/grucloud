---
id: ApiGatewayV2Api
title: Api
---

Manages an [Api Gateway V2 API](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.ApiGatewayV2.makeApi({
  name: "myApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApi-property)

## Used By

- [Authorizer](./ApiGatewayV2Authorizer)
- [Deployment](./ApiGatewayV2Deployment)
- [ApiMapping](./ApiGatewayV2ApiMapping)
- [Stage](./ApiGatewayV2Stage)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Apis can be filtered with the _Api_ type:

```sh
gc l -t Api
```

```txt

```
