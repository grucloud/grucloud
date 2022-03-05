---
id: Deployment
title: Deployment
---

Manages an [Api Gateway V2 Deployment](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    name: "my-api",
    properties: ({}) => ({
      ProtocolType: "HTTP",
      ApiKeySelectionExpression: "$request.header.x-api-key",
      DisableExecuteApiEndpoint: false,
      RouteSelectionExpression: "$request.method $request.path",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "my-api-stage-dev",
    properties: ({}) => ({
      AccessLogSettings: {
        Format:
          '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
      },
    }),
    dependencies: () => ({
      api: "my-api",
      logGroup: "lg-http-test",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    dependencies: () => ({
      api: "my-api",
      stage: "my-api-stage-dev",
    }),
  },
  { type: "LogGroup", group: "CloudWatchLogs", name: "lg-http-test" },
];
```

## Properties

- [CreateDeploymentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createdeploymentcommandinput.html)

## Dependencies

- [API](./Api.md)
- [Stage](./Stage.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)

## List

The Deployments can be filtered with the _Deployment_ type:

```sh
gc l -t Deployment
```

```txt

```
