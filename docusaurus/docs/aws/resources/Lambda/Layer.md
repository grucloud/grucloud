---
id: LambdaLayer
title: Layer
---

Provides an [Lambda Layer](https://console.aws.amazon.com/lambda/home?/layers)

## Examples

### Create a Layer for a Function

```js
const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const iamPolicy = provider.IAM.makePolicy({
  name: "lambda-policy",
  properties: () => lambdaPolicy,
});

const iamRole = provider.IAM.makeRole({
  name: "lambda-role",
  dependencies: { policies: [iamPolicy] },
  properties: () => lambdaAssumePolicy,
});

const layer = provider.Lambda.makeLayer({
  name: "lambda-layer",
  dependencies: { role: iamRole },
  properties: () => ({
    CompatibleRuntimes: ["nodejs"],
    Description: "My Layer",
  }),
});

const lambda = provider.Lambda.makeFunction({
  name: "lambda-hello-world",
  dependencies: { role: iamRole, layers: [layer] },
  properties: () => ({
    PackageType: "Zip",
    Handler: "helloworld.handler",
    Runtime: "nodejs14.x",
  }),
});
```

## Source Code Examples

- [hello world lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/lambda/nodejs/helloworkd/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#publishLayerVersion-property)

## Dependencies

- [Iam Role](../IAM/IamRole.md)

## UsedBy

- [LambdaFunction](./Function.md)

## List

The list of functions can be displayed and filtered with the type **Layer**:

```sh
gc list -t Layer
```

```txt

```
