---
id: ApiMapping
title: ApiMapping
---

Manages an [Api Gateway V2 ApiMapping](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "DomainName",
    group: "ApiGatewayV2",
    name: "grucloud.org",
    dependencies: () => ({
      certificate: "grucloud.org",
    }),
  },
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
    type: "Stage",
    group: "ApiGatewayV2",
    name: "my-api-stage-dev",
    properties: ({}) => ({
      AccessLogSettings: {
        Format:
          '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
      },
    }),
    dependencies: () => ({
      api: "my-api",
      logGroup: "lg-http-test",
    }),
  },
  {
    type: "ApiMapping",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ApiMappingKey: "",
    }),
    dependencies: () => ({
      api: "my-api",
      domainName: "grucloud.org",
      stage: "my-api-stage-dev",
    }),
  },
  { type: "LogGroup", group: "CloudWatchLogs", name: "lg-http-test" },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property)

## Dependencies

- [API](./Api.md)
- [Stage](./Stage.md)
- [DomainName](./DomainName.md)

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
