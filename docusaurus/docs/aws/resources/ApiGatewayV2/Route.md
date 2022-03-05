---
id: Route
title: Route
---

Manages an [Api Gateway V2 Route](https://console.aws.amazon.com/apigateway/main/apis).

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
    type: "Authorizer",
    group: "ApiGatewayV2",
    name: "authorizer-auth0",
    properties: ({}) => ({
      AuthorizerType: "JWT",
      IdentitySource: ["$request.header.Authorization"],
      JwtConfiguration: {
        Audience: ["https://api.grucloud.org"],
        Issuer: "https://dev-zojrhsju.us.auth0.com/",
      },
    }),
    dependencies: () => ({
      api: "my-api",
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
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ApiKeyRequired: false,
      AuthorizationType: "JWT",
      RouteKey: "ANY /my-function",
    }),
    dependencies: () => ({
      api: "my-api",
      integration: "integration::my-api::my-function",
      authorizer: "authorizer-auth0",
    }),
  },
  { type: "LogGroup", group: "CloudWatchLogs", name: "lg-http-test" },
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

- [CreateRouteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createroutecommandinput.html)

## Dependencies

- [API](./Api.md)
- [Integration](./Integration.md)
- [Authorizer](./Authorizer.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)

## List

The Routes can be filtered with the _ApiGatewayV2::Route_ type:

```sh
gc l -t ApiGatewayV2::Route
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 7/7
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::Route from aws                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: route::my-api::ANY /my-function                                              │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   ApiKeyRequired: false                                                            │
│   AuthorizationType: NONE                                                          │
│   RouteId: ytbyc2l                                                                 │
│   RouteKey: ANY /my-function                                                       │
│   Target: integrations/tcymupe                                                     │
│   ApiId: 7a38wlw431                                                                │
│   ApiName: my-api                                                                  │
│   Tags:                                                                            │
│     gc-managed-by: grucloud                                                        │
│     gc-project-name: @grucloud/example-aws-api-gateway-lambda                      │
│     gc-stage: dev                                                                  │
│     gc-created-by-provider: aws                                                    │
│     Name: my-api                                                                   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├─────────────────────┬─────────────────────────────────────────────────────────────┤
│ ApiGatewayV2::Route │ route::my-api::ANY /my-function                             │
└─────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::Route" executed in 11s
```
