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
gc l -t ApiGatewayV2::Deployment
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::Deployment from aws                        │
├────────────────────────────────────────────────────────────┤
│ name: deployment::my-api                                   │
│ managedByUs: Yes                                           │
│ live:                                                      │
│   AutoDeployed: false                                      │
│   CreatedDate: 2022-03-10T02:57:19.000Z                    │
│   DeploymentId: dni6x2                                     │
│   DeploymentStatus: DEPLOYED                               │
│   ApiId: kfd5t0wyr4                                        │
│   ApiName: my-api                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────┐
│ aws                                                       │
├──────────────────────────┬────────────────────────────────┤
│ ApiGatewayV2::Deployment │ deployment::my-api             │
└──────────────────────────┴────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::Deployment" executed in 5s, 214 MB

```
