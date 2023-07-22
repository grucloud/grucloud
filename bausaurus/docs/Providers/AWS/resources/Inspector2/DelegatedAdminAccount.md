---
id: DelegatedAdminAccount
title: Delegated Admin Account
---

Manages an [AWS Inspector2 Delegated Admin Account](https://console.aws.amazon.com/inspector/v2/home?#/get-started).

## Example

```js
exports.createResources = () => [
  {
    type: "DelegatedAdminAccount",
    group: "Inspector2",
    dependencies: ({}) => ({
      account: "test account",
    }),
  },
];
```

## Code Examples

- [inspector2-simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/Inspector2/inspector2-simple)

## Properties

- [EnableDelegatedAdminAccountCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-inspector2/interfaces/enabledelegatedadminaccountcommandinput.html)

## Dependencies

- [Organisations Account](../Organisations/Account.md)

## Used By

## List

```sh
gc l -t Inspector2::DelegatedAdminAccount
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Inspector2::DelegatedAdminAccount from aws                                      │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                     │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   delegatedAdminAccountId: 440541460065                                           │
│   status: ENABLED                                                                 │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├───────────────────────────────────┬──────────────────────────────────────────────┤
│ Inspector2::DelegatedAdminAccount │ default                                      │
└───────────────────────────────────┴──────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Inspector2::DelegatedAdminAccount" executed in 3s, 116 MB
```
