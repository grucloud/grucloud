---
id: ApiGatewayV2ApiMapping
title: ApiMapping
---

Manages an [Api Gateway V2 ApiMapping](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.ApiGatewayV2.makeApiMapping({
  properties: ({ config }) => ({
    ApiMappingKey: "",
  }),
  dependencies: ({ resources }) => ({
    api: resources.ApiGatewayV2.Api.myApi,
    domainName: resources.ApiGatewayV2.DomainName.grucloudOrg,
    stage: resources.ApiGatewayV2.Stage.myApiStageDev,
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property)

## Dependencies

- [API](./ApiGatewayV2Api)
- [Stage](./ApiGatewayV2Stage)
- [DomainName](./ApiGatewayV2DomainName)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

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
