---
id: APIGatewayAccount
title: Account
---

Manages an [API Gateway Account](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

Update the api gateway account with a CloudWatch role:

```js
provider.IAM.makeRole({
  name: "roleApiGatewayCloudWatch",
  dependencies: {
    policies: [
      "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
    ],
  },
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "",
          Effect: "Allow",
          Principal: {
            Service: "apigateway.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      ],
    },
  }),
});

provider.APIGateway.makeAccount({
  name: "default",
  dependencies: ({ resources }) => ({
    cloudwatchRole: resources.IAM.Role.roleApiGatewayCloudWatch,
  }),
});
```

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

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
