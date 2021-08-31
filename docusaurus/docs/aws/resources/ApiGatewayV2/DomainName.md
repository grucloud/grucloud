---
id: ApiGatewayV2DomainName
title: DomainName
---

Manages an [Api Gateway V2 Domain Name](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const apiGatewayDomainName = provider.ApiGatewayV2.makeDomainName({
  name: config.domainName,
  dependencies: { certificate },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDomainName-property)

## Dependencies

- [Certificate](../ACM/AcmCertificate)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The DomainNames can be filtered with the _DomainName_ type:

```sh
gc l -t DomainName
```

```txt

```
