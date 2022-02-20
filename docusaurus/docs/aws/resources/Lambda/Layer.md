---
id: Layer
title: Layer
---

Provides an [Lambda Layer](https://console.aws.amazon.com/lambda/home?/layers)

## Examples

### Create a Layer for a Function

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
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    name: "lambda-layer",
    properties: ({}) => ({
      LayerName: "lambda-layer",
      Description: "My Layer",
      CompatibleRuntimes: ["nodejs"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "lambda-hello-world",
    properties: ({}) => ({
      Handler: "helloworld.handler",
      PackageType: "Zip",
      Runtime: "nodejs14.x",
      Description: "",
      Timeout: 3,
      MemorySize: 128,
    }),
    dependencies: () => ({
      layers: ["lambda-layer"],
      role: "lambda-role",
    }),
  },
];
```

## Source Code Examples

- [hello world lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/lambda/nodejs/helloworkd/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#publishLayerVersion-property)

## Dependencies

- [Iam Role](../IAM/Role.md)

## UsedBy

- [LambdaFunction](./Function.md)

## List

The list of functions can be displayed and filtered with the type **Layer**:

```sh
gc list -t Layer
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────┐
│ 1 Lambda::Layer from aws                                     │
├──────────────────────────────────────────────────────────────┤
│ name: lambda-layer                                           │
│ managedByUs: Yes                                             │
│ live:                                                        │
│   LayerVersionArn: arn:aws:lambda:us-east-1:840541460064:la… │
│   Version: 76                                                │
│   Description: My Layer                                      │
│   CreatedDate: 2022-02-20T04:43:59.382+0000                  │
│   CompatibleRuntimes:                                        │
│     - "nodejs"                                               │
│   LicenseInfo: null                                          │
│   LayerName: lambda-layer                                    │
│   LayerArn: arn:aws:lambda:us-east-1:840541460064:layer:lam… │
│   Tags:                                                      │
│     Name: lambda-layer                                       │
│     gc-managed-by: grucloud                                  │
│     gc-created-by-provider: aws                              │
│     gc-stage: dev                                            │
│     gc-project-name: @grucloud/example-aws-lambda-nodejs-he… │
│   Content:                                                   │
│     Location: https://prod-04-2014-layers.s3.us-east-1.amaz… │
│     CodeSha256: m0OVorKW9quIKFgQSOX3h27KIi2ckpGG3W1T6pqByYc= │
│     CodeSize: 145                                            │
│     SigningProfileVersionArn: null                           │
│     SigningJobArn: null                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────┐
│ aws                                                         │
├───────────────┬─────────────────────────────────────────────┤
│ Lambda::Layer │ lambda-layer                                │
└───────────────┴─────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Layer" executed in 3s
```
