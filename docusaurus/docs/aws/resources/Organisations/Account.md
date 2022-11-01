---
id: Account
title: Account
---

Provides an [Organisation Account](https://console.aws.amazon.com/organizations/v2/home?#)

```js
exports.createResources = () => [
  {
    type: "Account",
    group: "Organisations",
    properties: ({}) => ({
      Name: "test account",
      Email: "test@mydomain.com",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/Organisation/organisations-policy)

### Properties

- [CreateAccountCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/createaccountcommandinput.html)

### Dependencies

### Used By

- [Organisations Policy Attachment](./PolicyAttachment.md)

### List

```sh
gc l -t Organisations::Account
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────┐
│ 5 Organisations::Account from aws                                │
├──────────────────────────────────────────────────────────────────┤
│ name: test account                                               │
│ managedByUs: Yes                                                 │
│ live:                                                            │
│   Arn: arn:aws:organizations::840541460064:account/o-xs8pjirjbw… │
│   Email: test@grucloud.com                                       │
│   Id: 000542909724                                               │
│   JoinedMethod: CREATED                                          │
│   JoinedTimestamp: 2022-11-01T19:19:28.413Z                      │
│   Name: test account                                             │
│   Status: ACTIVE                                                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────┐
│ aws                                                             │
├────────────────────────┬────────────────────────────────────────┤
│ Organisations::Account │ test account                           │
└────────────────────────┴────────────────────────────────────────┘
5 resources, 1 type, 1 provider
Command "gc l -t Organisations::Account" executed in 3s, 102 MB
```
