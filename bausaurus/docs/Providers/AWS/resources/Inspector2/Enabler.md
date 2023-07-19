---
id: Enabler
title: Enabler
---

Enable the [AWS Inspector2](https://console.aws.amazon.com/inspector/v2/home?#/get-started).

## Example

```js
exports.createResources = () => [
  {
    type: "Enabler",
    group: "Inspector2",
    properties: ({}) => ({
      resourceTypes: ["EC2", "ECR"],
    }),
  },
];
```

## Code Examples

- [inspector2-simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/Inspector2/inspector2-simple)

## Properties

- [EnableCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-inspector2/interfaces/enablecommandinput.html)

## Used By

## List

```sh
gc l -t Inspector2::Enabler
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Inspector2::Enabler from aws                                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                     │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   resourceTypes:                                                                  │
│     - "EC2"                                                                       │
│     - "ECR"                                                                       │
│   state:                                                                          │
│     status: ENABLED                                                               │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├─────────────────────┬────────────────────────────────────────────────────────────┤
│ Inspector2::Enabler │ default                                                    │
└─────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Inspector2::Enabler" executed in 2s, 107 MB
```
