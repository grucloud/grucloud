---
id: Integration
title: Integration
---

Manages an [API Gateway Integration](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [PutIntegrationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/putintegrationcommandinput.html)

## Dependencies

- [Method](./Method.md)
- [Lambda Function](../Lambda/Function.md)

## Full Examples

- [apigw-rest-api-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/apigw-rest-api-dynamodb)

## List

The integrations can be filtered with the _APIGateway::Integration_ type:

```sh
gc l -t APIGateway::Integration
```

```txt

```
