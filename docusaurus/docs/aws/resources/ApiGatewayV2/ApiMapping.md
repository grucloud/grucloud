---
id: ApiGatewayV2ApiMapping
title: ApiMapping
---

Manages an [Api Gateway V2 ApiMapping](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const apiGatewayDomainName = provider.ApiGatewayV2.makeDomainName({
  name: config.domainName,
  dependencies: { certificate },
  properties: () => ({}),
});

const api = provider.ApiGatewayV2.makeApi({
  name: "my-api",
  properties: () => ({}),
});

const stage = provider.ApiGatewayV2.makeStage({
  name: "my-api-stage-dev",
  dependencies: { api },
  properties: () => ({}),
});

provider.ApiGatewayV2.makeApiMapping({
  name: "api-mapping-dev",
  dependencies: { api, stage, domainName: apiGatewayDomainName },
  properties: () => ({ ApiMappingKey: "my-function" }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property)

## Dependencies

- [API](./ApiGatewayV2Api)
- [Stage](./ApiGatewayV2Stage)
- [DomainName](./ApiGatewayV2DomainName)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The ApiMappings can be filtered with the _ApiMapping_ type:

```sh
gc l -t ApiMapping
```

```txt

```
