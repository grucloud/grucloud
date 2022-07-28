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
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "lambda-layer",
      Description: "My Layer",
      CompatibleRuntimes: ["nodejs"],
    }),
  },
];
```

## Source Code Examples

- [hello world lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/Lambda/nodejs/helloworld)
- [serverless-patterns lamdba-layer-terraform](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/lambda-layer-terraform)

## Properties

- [PublishLayerVersionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/publishlayerversioncommandinput.html)

## UsedBy

- [Lambda Function](./Function.md)

## List

The list of layers can be displayed and filtered with the type **Layer**:

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
