---
id: Account
title: Account
---

Manages an [API Gateway Account](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

Update the api gateway account with a CloudWatch role:

```js
exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    dependencies: () => ({
      cloudwatchRole: "roleApiGatewayCloudWatch",
    }),
  },
];
```

## Properties

- [UpdateAccountCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/updateaccountcommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/APIGateway/restapi-lambda)
- [serverless-patterns apigw-dynamodb-terraform](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-dynamodb-terraform)
- [serverless-patterns apigw-rest-api-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-rest-api-dynamodb)
- [wafv2-apigateway-rest](https://github.com/grucloud/grucloud/tree/main/examples/aws/WAFv2/wafv2-apigateway-rest)

## List

The account settings can be filtered with the _Account_ type:

```sh
gc l -t Account
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 APIGateway::Account from aws                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                               │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   cloudwatchRoleArn: arn:aws:iam::840541460064:role/roleApiGatewayCloudWat… │
│   throttleSettings:                                                         │
│     burstLimit: 5000                                                        │
│     rateLimit: 10000                                                        │
│   features:                                                                 │
│     - "UsagePlans"                                                          │
│   apiKeyVersion: 4                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├─────────────────────┬──────────────────────────────────────────────────────┤
│ APIGateway::Account │ default                                              │
└─────────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
```
