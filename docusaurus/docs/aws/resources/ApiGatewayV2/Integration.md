---
id: Integration
title: Integration
---

Manages an [Api Gateway V2 Integration](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.ApiGatewayV2.makeIntegration({
  properties: ({ config }) => ({
    ConnectionType: "INTERNET",
    IntegrationMethod: "POST",
    IntegrationType: "AWS_PROXY",
    PayloadFormatVersion: "2.0",
  }),
  dependencies: ({ resources }) => ({
    api: resources.ApiGatewayV2.Api.myApi,
    lambdaFunction: resources.Lambda.Function.myFunction,
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegration-property)

## Dependencies

- [API](./Api.md)
- [Lambda Function](../Lambda/Function.md)

## Used By

- [Route](./Route.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

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
