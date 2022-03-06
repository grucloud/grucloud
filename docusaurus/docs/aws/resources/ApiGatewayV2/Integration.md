---
id: Integration
title: Integration
---

Manages an [Api Gateway V2 Integration](https://console.aws.amazon.com/apigateway/main/apis).

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
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: () => ({
      api: "my-api",
      lambdaFunction: "my-function",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "lambda-role",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["lambda-policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "lambda-policy",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "my-function",
    properties: ({}) => ({
      Handler: "my-function.handler",
      PackageType: "Zip",
      Runtime: "nodejs14.x",
      Description: "",
      Timeout: 3,
      MemorySize: 128,
    }),
    dependencies: () => ({
      role: "lambda-role",
    }),
  },
];
```

## Properties

- [CreateIntegrationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createintegrationcommandinput.html)

## Dependencies

- [API](./Api.md)
- [Lambda Function](../Lambda/Function.md)

## Used By

- [Route](./Route.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)

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
