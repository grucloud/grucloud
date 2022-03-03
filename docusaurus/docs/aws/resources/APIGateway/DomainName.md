---
id: DomainName
title: Domain Name
---

Manages an [API Gateway Domain Name](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "DomainName",
    group: "APIGateway",
    name: "mydomain.com",
    dependencies: () => ({ certificate: "mydomain.com" }),
  },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDomainName-property)

## Dependencies

- [Certificate](../ACM/Certificate)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda)

## List

The DomainNames can be filtered with the _DomainName_ type:

```sh
gc l -t DomainName
```

```txt

```
