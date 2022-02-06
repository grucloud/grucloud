---
id: DomainName
title: Domain Name
---

Manages an [API Gateway Domain Name](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
const apiGatewayDomainName = provider.APIGateway.makeDomainName({
  name: config.domainName,
  dependencies: { certificate: "grucloud.org." },
  properties: () => ({}),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDomainName-property)

## Dependencies

- [Certificate](../ACM/Certificate)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The DomainNames can be filtered with the _DomainName_ type:

```sh
gc l -t DomainName
```

```txt

```
