---
id: Parameter
title: Parameter
---

Manage a [System Manager Parameter](https://console.aws.amazon.com/systems-manager/parameters/).

## Example

Create a text parameter:

```js
exports.createResources = () => [
  {
    type: "Parameter",
    group: "SSM",
    name: "text-param",
    properties: ({}) => ({
      Type: "String",
      Value: "my-value",
      DataType: "text",
      Tags: [
        {
          Key: "TOTOKEY",
          Value: "TOTOVALUE",
        },
      ],
    }),
  },
];
```

## Code Examples

- [Simple Example](https://github.com/grucloud/grucloud/blob/main/examples/aws/SSM/ssm-param)

## Properties

- [PutParameterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/interfaces/putparametercommandinput.html)

## List

```sh
gc l -t Parameter
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 ssm::Parameter from aws                                            │
├──────────────────────────────────────────────────────────────────────┤
│ name: text-param                                                     │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   Name: text-param                                                   │
│   Type: String                                                       │
│   Value: my-value                                                    │
│   Version: 1                                                         │
│   LastModifiedDate: 2021-08-29T18:14:11.462Z                         │
│   ARN: arn:aws:ssm:eu-west-2:840541460064:parameter/text-param       │
│   DataType: text                                                     │
│   Tags:                                                              │
│     - Key: gc-created-by-provider                                    │
│       Value: aws                                                     │
│     - Key: gc-managed-by                                             │
│       Value: grucloud                                                │
│     - Key: gc-project-name                                           │
│       Value: example-grucloud-ssm-parameter                          │
│     - Key: gc-stage                                                  │
│       Value: dev                                                     │
│     - Key: Name                                                      │
│       Value: text-param                                              │
│     - Key: TOTOKEY                                                   │
│       Value: TOTOVALUE                                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────┐
│ aws                                                             │
├────────────────────────────────┬────────────────────────────────┤
│ ssm::Parameter                 │ text-param                     │
└────────────────────────────────┴────────────────────────────────┘
```
