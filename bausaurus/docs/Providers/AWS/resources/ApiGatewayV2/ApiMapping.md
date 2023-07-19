---
id: ApiMapping
title: ApiMapping
---

Manages an [Api Gateway V2 ApiMapping](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ApiMapping",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ApiMappingKey: "",
    }),
    dependencies: () => ({
      domainName: "grucloud.org",
      stage: "my-api::stage-dev",
    }),
  },
];
```

## Properties

- [CreateApiMappingCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createapimappingcommandinput.html)

## Dependencies

- [Stage](./Stage.md)
- [DomainName](./DomainName.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)

## List

The ApiMappings can be filtered with the _ApiGatewayV2::ApiMapping_ type:

```sh
gc l -t ApiGatewayV2::ApiMapping
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::ApiMapping from aws                                                │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: apimapping::grucloud.org::my-api::my-api-stage-dev::                         │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   ApiId: 7a38wlw431                                                                │
│   ApiMappingId: k2qu32                                                             │
│   ApiMappingKey:                                                                   │
│   Stage: my-api-stage-dev                                                          │
│   DomainName: grucloud.org                                                         │
│   ApiName: my-api                                                                  │
│   Tags:                                                                            │
│     gc-project-name: @grucloud/example-aws-api-gateway-lambda                      │
│     gc-managed-by: grucloud                                                        │
│     gc-stage: dev                                                                  │
│     gc-created-by-provider: aws                                                    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├──────────────────────────┬────────────────────────────────────────────────────────┤
│ ApiGatewayV2::ApiMapping │ apimapping::grucloud.org::my-api::my-api-stage-dev::   │
└──────────────────────────┴────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider

```
