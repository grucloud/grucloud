---
id: APIGatewayRestApi
title: RestApi
---

Manages an [API Gateway RestAPI](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const restApi = provider.APIGateway.makeRestApi({
  name: "myRestApi",
  properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createRestApi-property)

## Used By

- [Authorizer](./Authorizer)
- [Deployment](./Deployment)
- [Resource](./Resource)
- [Stage](./Stage)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The RestApis can be filtered with the _RestApi_ type:

```sh
gc l -t RestApi
```

```txt

```
