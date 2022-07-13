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

- [hello world lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/helloworld)

- [lambda called by an Api gateway](https://github.com/grucloud/grucloud/blob/main/example/aws/api-gateway/lambda)

- [lambda triggered by a write to an S3 Bucket](https://github.com/grucloud/grucloud/blob/main/example/aws/serverless-patterns/xray-lambdalayers-cdk-python)

## Properties

- [CreateFunctionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createfunctioncommandinput.html)

## Dependencies

- [Layer](./Layer.md)
- [Iam Role](../IAM/Role.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)
- [RDS Cluster](../RDS/DBCluster.md)
- [DynamoDB Table](../DynamoDB/Table.md)
- [AppSync Graphql](../AppSync/GraphqlApi.md)
- [EFS MountTarget](../EFS/MountTarget.md)

## Used By

- [ApiGateway Integration](../ApiGatewayV2/Integration.md)
- [S3 Bucket](../S3/Bucket.md)
- [StepFunctions StateMachine](../StepFunctions/StateMachine.md)

## List

The list of functions can be displayed and filtered with the type **Function**:

```sh
gc list -t Function
```

```txt
┌──────────────────────────────────────────────────────────────────┐
│ 2 Lambda::Function from aws                                      │
├──────────────────────────────────────────────────────────────────┤
│ name: LambdaLayerXRayStackStack-BucketNotificationsHandl-1XcDZ1… │
│ managedByUs: Yes                                                 │
│ live:                                                            │
│   Configuration:                                                 │
│     Architectures:                                               │
│       - "x86_64"                                                 │
│     CodeSha256: hzxBwXE8vF5htCF3abiYzTqjRnM2KRxbveRsojrrXhs=     │
│     CodeSize: 1337                                               │
│     Description: AWS CloudFormation handler for "Custom::S3Buck… │
│     EphemeralStorage:                                            │
│       Size: 512                                                  │
│     FunctionArn: arn:aws:lambda:us-east-1:840541460064:function… │
│     FunctionName: LambdaLayerXRayStackStack-BucketNotifications… │
│     Handler: index.handler                                       │
│     LastModified: 2022-04-17T18:32:29.881+0000                   │
│     LastUpdateStatus: Successful                                 │
│     MemorySize: 128                                              │
│     PackageType: Zip                                             │
│     RevisionId: fee4d397-44a6-4dfe-b070-9b0c8204d012             │
│     Role: arn:aws:iam::840541460064:role/LambdaLayerXRayStackSt… │
│     Runtime: python3.7                                           │
│     State: Active                                                │
│     Timeout: 300                                                 │
│     TracingConfig:                                               │
│       Mode: PassThrough                                          │
│     Version: $LATEST                                             │
│   Code:                                                          │
│     Location: https://prod-04-2014-tasks.s3.us-east-1.amazonaws… │
│     RepositoryType: S3                                           │
│   Tags:                                                          │
│     aws:cloudformation:stack-name: LambdaLayerXRayStackStack     │
│     gc-project-name: xray-lambdalayers-cdk-python                │
│     aws:cloudformation:stack-id: arn:aws:cloudformation:us-east… │
│     aws:cloudformation:logical-id: BucketNotificationsHandler05… │
│     gc-managed-by: grucloud                                      │
│     gc-stage: dev                                                │
│     gc-created-by-provider: aws                                  │
│     Name: LambdaLayerXRayStackStack-BucketNotificationsHandl-1X… │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
```
