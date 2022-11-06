---
id: AlternateAccount
title: Alternate Account
---

Manages an [Alternate Account](https://console.aws.amazon.com/billing/home&skipRegion=true#/account).

## Sample code

```js
exports.createResources = () => [
  {
    type: "AlternateAccount",
    group: "Account",
    properties: ({}) => ({
      AlternateContactType: "BILLING",
      EmailAddress: "frederic@mail.com",
      Name: "Frederic",
      PhoneNumber: "+33678912345",
      Title: "Mr",
    }),
  },
  {
    type: "AlternateAccount",
    group: "Account",
    properties: ({}) => ({
      AlternateContactType: "OPERATIONS",
      EmailAddress: "frederic@mail.com",
      Name: "Frederic",
      PhoneNumber: "+33678912345",
      Title: "Mr",
    }),
  },
  {
    type: "AlternateAccount",
    group: "Account",
    properties: ({}) => ({
      AlternateContactType: "SECURITY",
      EmailAddress: "frederic@mail.com",
      Name: "Frederic",
      PhoneNumber: "+33678912345",
      Title: "Mr",
    }),
  },
];
```

## Properties

- [PutAlternateContactCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-account/interfaces/putalternatecontactcommandinput.html)

## Full Examples

- [account-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Account/account-simple)

## List

```sh
gc l -t Account::AlternateAccount
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────┐
│ 3 Account::AlternateAccount from aws                                  │
├───────────────────────────────────────────────────────────────────────┤
│ name: BILLING                                                         │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   AlternateContactType: BILLING                                       │
│   EmailAddress: frederic@mail.com                                     │
│   Name: Frederic                                                      │
│   PhoneNumber: +33678912345                                           │
│   Title: Mr                                                           │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│ name: OPERATIONS                                                      │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   AlternateContactType: OPERATIONS                                    │
│   EmailAddress: frederic@mail.com                                     │
│   Name: Frederic                                                      │
│   PhoneNumber: +33678912345                                           │
│   Title: Mr                                                           │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│ name: SECURITY                                                        │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   AlternateContactType: SECURITY                                      │
│   EmailAddress: frederic@mail.com                                     │
│   Name: Frederic                                                      │
│   PhoneNumber: +33678912345                                           │
│   Title: Mr                                                           │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├───────────────────────────┬──────────────────────────────────────────┤
│ Account::AlternateAccount │ BILLING                                  │
│                           │ OPERATIONS                               │
│                           │ SECURITY                                 │
└───────────────────────────┴──────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t Account::AlternateAccount" executed in 2s, 105 MB
```
