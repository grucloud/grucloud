---
id: Api
title: Api
---

Manages an [Api Gateway V2 API](https://console.aws.amazon.com/apigateway/main/apis).

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
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApi-property)

## Used By

- [Authorizer](./Authorizer.md)
- [Deployment](./Deployment.md)
- [ApiMapping](./ApiMapping.md)
- [Stage](./Stage.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Apis can be filtered with the _Api_ type:

```sh
gc l -t ApiGatewayV2::Api
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::Api from aws                                              │
├───────────────────────────────────────────────────────────────────────────┤
│ name: my-api                                                              │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   ApiEndpoint: https://7a38wlw431.execute-api.eu-west-2.amazonaws.com     │
│   ApiId: 7a38wlw431                                                       │
│   ApiKeySelectionExpression: $request.header.x-api-key                    │
│   CreatedDate: 2021-10-14T17:37:14.000Z                                   │
│   DisableExecuteApiEndpoint: false                                        │
│   Name: my-api                                                            │
│   ProtocolType: HTTP                                                      │
│   RouteSelectionExpression: $request.method $request.path                 │
│   Tags:                                                                   │
│     gc-managed-by: grucloud                                               │
│     gc-project-name: @grucloud/example-aws-api-gateway-lambda             │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     Name: my-api                                                          │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────────┬──────────────────────────────────────────────────────┤
│ ApiGatewayV2::Api │ my-api                                               │
└───────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::Api" executed in 3s
```
