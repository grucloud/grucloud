---
id: Route
title: Route
---

Manages an [Api Gateway V2 Route](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.ApiGatewayV2.makeRoute({
  properties: ({ config }) => ({
    ApiKeyRequired: false,
    AuthorizationType: "NONE",
    RouteKey: "ANY /my-function",
  }),
  dependencies: ({  }) => ({
    api: "my-api"
    integration: "integrationMyApiMyFunction"
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRoute-property)

## Dependencies

- [API](./Api.md)
- [Integration](./Integration.md)
- [Authorizer](./Authorizer.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

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
