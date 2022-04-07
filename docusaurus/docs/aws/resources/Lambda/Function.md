---
id: Function
title: Function
---

Provides an [Lambda Function](https://console.aws.amazon.com/lambda/home)

## Examples

### Create a Lambda Function

```js
exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "lambda-role",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["lambda-policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "lambda-policy",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "lambda-hello-world",
    properties: ({}) => ({
      Configuration: {
        Handler: "helloworld.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: () => ({
      role: "lambda-role",
    }),
  },
];
```

## Source Code Examples

- [hello world lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/helloworkd/resources.js)

- [lambda called by an Api gateway](https://github.com/grucloud/grucloud/blob/main/example/aws/api-gateway/lambda/resources.js)

## Properties

- [CreateFunctionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createfunctioncommandinput.html)

## Dependencies

- [Layer](./Layer.md)
- [Iam Role](../IAM/Role.md)
- [SecretsManager Secret](../SecretsManager/Secrets.md)
- [RDS Cluster](../RDS/Cluster.md)
- [DynamoDB Table](../DynampDB/Table.md)
- [AppSync Graphql](../AppSync/GraphqlApi)

## UsedBy

- [ApiGateway Integration](../ApiGatewayV2/Integration.md)

## List

The list of functions can be displayed and filtered with the type **Function**:

```sh
gc list -t Function
```

```txt

```
