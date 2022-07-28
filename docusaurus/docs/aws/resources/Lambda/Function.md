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
    properties: ({}) => ({
      Configuration: {
        FunctionName: "lambda-hello-world",
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

- [ApiGatewayV2 http-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/ApiGatewayV2/http-lambda)
- [hello world lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/Lambda/nodejs/helloworld)
- [lambda url](https://github.com/grucloud/grucloud/blob/main/examples/aws/Lambda/nodejs/lambda-url)
- [lambda sqs](https://github.com/grucloud/grucloud/blob/main/examples/aws/Lambda/nodejs/sqs-lambda)
- [AppSync graphql](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppSync/graphql)
- [CloudWatch Subscription Filter](https://github.com/grucloud/grucloud/blob/main/examples/aws/CloudWatchLogs/subscription-filter)
- [EFS simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/EFS/efs-simple)
- [Firehose stream](https://github.com/grucloud/grucloud/blob/main/examples/aws/Firehose/firehose-delivery-stream)
- [Kinesis stream](https://github.com/grucloud/grucloud/blob/main/examples/aws/Kinesis/kinesis-stream)
- [serverless-patterns apigw-http-api-eventbridge](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-http-api-eventbridge)
- [serverless-patterns apigw-websocket-api-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-websocket-api-lambda)
- [serverless-patterns cdk-lambda-appsync](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/cdk-lambda-appsync)
- [serverless-patterns cdk-vpc-lambda-sfn](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/cdk-vpc-lambda-sfn)
- [serverless-patterns cognito-httpapi](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/cognito-httpapi)
- [serverless-patterns lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda)
- [serverless-patterns lambda-aurora-serverless](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda-aurora-serverless)
- [serverless-patterns lambda-cloudwatch](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda-cloudwatch)
- [serverless-patterns lambda-dynamodb](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda-dynamodb)
- [serverless-patterns lambda-layer-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda-layer-terraform)
- [serverless-patterns lambda-s3](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda-s3)
- [serverless-patterns lambda-ssm-parameter](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/lambda-ssm-parameter)
- [serverless-patterns sfn-apigw](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/sfn-apigw)
- [serverless-patterns sns-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/sns-lambda)
- [serverless-patterns sqs-lambda-terraform-python](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/sqs-lambda-terraform-python)
- [serverless-patterns step-functions-lambda-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/step-functions-lambda-terraform)
- [serverless-patterns systems-manager-automation-to-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/systems-manager-automation-to-lambda)
- [serverless-patterns ta-eventbridge-lambda-s3](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/ta-eventbridge-lambda-s3)
- [lambda triggered by a write to an S3 Bucket](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/xray-lambdalayers-cdk-python)

## Properties

- [CreateFunctionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createfunctioncommandinput.html)

## Dependencies

- [AppSync Graphql](../AppSync/GraphqlApi.md)
- [DynamoDB Table](../DynamoDB/Table.md)
- [EFS MountTarget](../EFS/MountTarget.md)
- [Iam Role](../IAM/Role.md)
- [KMS Key](../KMS/Key.md)
- [Layer](./Layer.md)
- [RDS Cluster](../RDS/DBCluster.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)

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
