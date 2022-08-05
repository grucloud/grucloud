---
id: Integration
title: Integration
---

Manages an [Api Gateway V2 Integration](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

### Lambda integration

```js
exports.createResources = () => [
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: ({}) => ({
      api: "my-api",
      lambdaFunction: "my-function",
    }),
  },
];
```

### Load Balancer integration

```js
exports.createResources = () => [
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "VPC_LINK",
      Description: "API Integration with AWS Fargate Service",
      IntegrationMethod: "GET",
      IntegrationType: "HTTP_PROXY",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
    }),
    dependencies: ({}) => ({
      api: "ApigwFargate",
      listener: "listener::CdkSt-MyFar-RZX6AW5H3B08::HTTP::80",
      vpcLink: "V2 VPC Link",
    }),
  },
];
```

### Event Bus integration

```js
exports.createResources = () => [
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationSubtype: "EventBridge-PutEvents",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        DetailType: "MyDetailType",
        Source: "WebApp",
        Detail: "$request.body",
      },
      RequestTemplates: {},
      TimeoutInMillis: 10000,
    }),
    dependencies: ({}) => ({
      api: "MyHttpApi",
      eventBus: "MyEventBus",
      role: "ApiEventbridgeStack-EventBridgeIntegrationRoleB322-V1AK3L262GGK",
    }),
  },
];
```

## Properties

- [CreateIntegrationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createintegrationcommandinput.html)

## Dependencies

- [API](./Api.md)
- [Lambda Function](../Lambda/Function.md)
- [Event Bus](../CloudWatchEvents/EventBus.md)
- [Load Balancer Listener](../ElasticLoadBalancingV2/Listener.md)
- [Vpc Link](./VpcLink.md)

## Used By

- [Route](./Route.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)
- [apigw-vpclink-pvt-alb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)
- [apigw-fargate-cdk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk)
- [apigw-http-api-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-eventbridge)
- [apigw-websocket-api-lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-websocket-api-lambda)
- [cognito-httpapi](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cognito-httpapi)

## List

The Integrations can be filtered with the _ApiGatewayV2::Integration_ type:

```sh
gc l -t ApiGatewayV2::Integration
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::Integration from aws                                               │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: integration::my-api::my-function                                             │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   ConnectionType: INTERNET                                                         │
│   IntegrationId: tcymupe                                                           │
│   IntegrationMethod: POST                                                          │
│   IntegrationType: AWS_PROXY                                                       │
│   IntegrationUri: arn:aws:lambda:eu-west-2:840541460064:function:my-function       │
│   PayloadFormatVersion: 2.0                                                        │
│   TimeoutInMillis: 30000                                                           │
│   ApiId: 7a38wlw431                                                                │
│   ApiName: my-api                                                                  │
│   Tags:                                                                            │
│     gc-managed-by: grucloud                                                        │
│     gc-project-name: @grucloud/example-aws-api-gateway-lambda                      │
│     gc-stage: dev                                                                  │
│     gc-created-by-provider: aws                                                    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├───────────────────────────┬───────────────────────────────────────────────────────┤
│ ApiGatewayV2::Integration │ integration::my-api::my-function                      │
└───────────────────────────┴───────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::Integration" executed in 10s
```
