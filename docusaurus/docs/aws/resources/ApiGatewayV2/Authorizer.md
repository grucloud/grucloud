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

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createAuthorizer-property)

## Dependencies

- [API](./Api.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)

## List

The Authorizers can be filtered with the _Authorizer_ type:

```sh
gc l -t Authorizer
```

```txt

```
