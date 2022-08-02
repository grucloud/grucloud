---
id: Function
title: Function
---

Provides a CloudFront Function

## Sample Code

```js
exports.createResources = () => [
  {
    type: "Function",
    group: "CloudFront",
    properties: ({}) => ({
      ContentType: "application/octet-stream",
      FunctionCode:
        "//A version of the homepage\nvar X_Experiment_A = 'index.html';\n//B version of the homepage\nvar X_Experiment_B = 'index_b.html';\n\nfunction handler(event) {\n    var request = event.request;\n    if (Math.random() < 0.8) {\n        request.uri = '/' + X_Experiment_A;\n    } else {\n        request.uri = '/' + X_Experiment_B;\n    }\n    //log which version is displayed\n    console.log('X_Experiment_V ' + (request.uri == '/index.html' ? 'A_VERSION' : 'B_VERSION'));\n    return request;\n}",
      Name: "us-east-1CloudfronS3CdkPythonStackFunction980062BC",
      FunctionConfig: {
        Runtime: "cloudfront-js-1.0",
      },
      FunctionMetadata: {
        Stage: "DEVELOPMENT",
      },
    }),
  },
];
```

## Examples

- [eventbridge-api-destinations zendesk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cloudfront-cff-s3-cdk-python)

### Properties

- [CreateFunctionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/interfaces/createfunctioncommandinput.html)

## Used By

## List

```sh
gc list -t CloudFront::Function
```

```txt

```
