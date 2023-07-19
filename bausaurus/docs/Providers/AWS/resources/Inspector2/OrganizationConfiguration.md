---
id: OrganizationConfiguration
title: Organization Configuration
---

Manages an [AWS Inspector2 Organization Configuration](https://console.aws.amazon.com/inspector/v2/home?#/get-started).

## Example

```js
exports.createResources = () => [
  {
    type: "OrganizationConfiguration",
    group: "Inspector2",
    properties: ({}) => ({
      autoEnable: {
        ec2: true,
        ecr: true,
      },
    }),
  },
];
```

## Code Examples

- [inspector2-simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/Inspector2/inspector2-simple)

## Properties

- [UpdateOrganizationConfigurationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-inspector2/interfaces/updateorganizationconfigurationcommandinput.html)

## Used By

## List

```sh
gc l -t Inspector2::OrganizationConfiguration
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Inspector2::OrganizationConfiguration from aws                                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                     │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   autoEnable:                                                                     │
│     ec2: true                                                                     │
│     ecr: true                                                                     │
│   maxAccountLimitReached: false                                                   │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├───────────────────────────────────────┬──────────────────────────────────────────┤
│ Inspector2::OrganizationConfiguration │ default                                  │
└───────────────────────────────────────┴──────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Inspector2::OrganizationConfiguration" executed in 3s, 110 MB
```
