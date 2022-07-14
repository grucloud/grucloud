---
id: Authorizer
title: Authorizer
---

Manages an [Api Gateway V2 Authorizer](https://console.aws.amazon.com/apigateway/main/apis).

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
];
```

## Properties

- [CreateAuthorizerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createauthorizercommandinput.html)

## Dependencies

- [API](./Api.md)
- [User Pool](../CognitoIdentityServiceProvider/UserPool.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)
- [cognito-httpapi](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cognito-httpapi)

## List

The Authorizers can be filtered with the _ApiGatewayV2::Authorizer_ type:

```sh
gc l -t ApiGatewayV2::Authorizer
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::Authorizer from aws                        │
├────────────────────────────────────────────────────────────┤
│ name: authorizer-auth0                                     │
│ managedByUs: Yes                                           │
│ live:                                                      │
│   AuthorizerId: m9cvw2                                     │
│   AuthorizerType: JWT                                      │
│   IdentitySource:                                          │
│     - "$request.header.Authorization"                      │
│   JwtConfiguration:                                        │
│     Audience:                                              │
│       - "https://api.grucloud.org"                         │
│     Issuer: https://dev-zojrhsju.us.auth0.com/             │
│   Name: authorizer-auth0                                   │
│   ApiId: kfd5t0wyr4                                        │
│   ApiName: my-api                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────┐
│ aws                                                       │
├──────────────────────────┬────────────────────────────────┤
│ ApiGatewayV2::Authorizer │ authorizer-auth0               │
└──────────────────────────┴────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::Authorizer" executed in 4s, 211 MB

```
