---
id: UsagePlanKey
title: Usage Plan Key
---

Manages an [API Gateway Usage Plan](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
];
```

## Properties

- [CreateUsagePlanKeyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createusageplankeycommandinput.html)

## Dependencies

- [Usage Plan](./UsagePlan.md)

## Full Examples

- [apigw-rest-api-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-dynamodb-terraform)

## List

The user plan keys can be filtered with the _APIGateway::UsagePlanKey_ type:

```sh
gc l -t APIGateway::UsagePlanKey
```

```txt
```
