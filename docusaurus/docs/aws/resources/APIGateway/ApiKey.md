---
id: ApiKey
title: ApiKey
---

Manages an [API Gateway Api Key](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  { type: "ApiKey", group: "APIGateway", name: "my-key" },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createapikeycommandinput.html)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda)

## List

The api Keys can be filtered with the _ApiKey_ type:

```sh
gc l -t ApiKey
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 APIGateway::ApiKey from aws                                        │
├──────────────────────────────────────────────────────────────────────┤
│ name: my-key                                                         │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   id: nt8ab7856k                                                     │
│   name: my-key                                                       │
│   enabled: true                                                      │
│   createdDate: 2021-11-18T22:49:50.000Z                              │
│   lastUpdatedDate: 2021-11-18T22:49:50.000Z                          │
│   stageKeys: []                                                      │
│   tags:                                                              │
│     Name: my-key                                                     │
│     gc-created-by-provider: aws                                      │
│     gc-managed-by: grucloud                                          │
│     gc-project-name: @grucloud/example-aws-api-gateway-restapi-lamb… │
│     gc-stage: dev                                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├────────────────────┬────────────────────────────────────────────────┤
│ APIGateway::ApiKey │ my-key                                         │
└────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiKey" executed in 3s
```
