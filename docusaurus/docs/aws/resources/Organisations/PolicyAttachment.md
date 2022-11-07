---
id: PolicyAttachment
title: Policy Attachment
---

Provides an [Organisation Policy Attachment](https://console.aws.amazon.com/organizations/v2/home?#)

Attach a policy to an organisational unit:

```js
exports.createResources = () => [
  {
    type: "PolicyAttachment",
    group: "Organisations",
    dependencies: ({}) => ({
      policy: "my-policy",
      organisationalUnit: "my-ou",
    }),
  },
];
```

Attach a policy to an account:

```js
exports.createResources = () => [
  {
    type: "PolicyAttachment",
    group: "Organisations",
    dependencies: ({}) => ({
      policy: "my-policy",
      account: "test account",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/Organisation/organisations-policy)

### Properties

- [AttachPolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/attachpolicycommandinput.html)

### Dependencies

- [Organisations Policy](./Policy.md)
- [Organisations Account](./Account.md)
- [Organisations Root](./Root.md)
- [Organisations Organisational Unit](./OrganisationalUnit.md)

### List

```sh
gc l -t Organisations::PolicyAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 4/4
┌──────────────────────────────────────────────────────────────────────────┐
│ 9 Organisations::PolicyAttachment from aws                               │
├──────────────────────────────────────────────────────────────────────────┤
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Arn: arn:aws:organizations::840541460065:account/o-xs8pjirjbw/1614084… │
│   Name: grucloud app                                                     │
│   TargetId: 161408406883                                                 │
│   Type: ACCOUNT                                                          │
│   PolicyId: p-FullAWSAccess                                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: policy-attach::FullAWSAccess::my-ou                                │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Arn: arn:aws:organizations::840541460065:ou/o-xs8pjirjbw/ou-941x-ad28… │
│   Name: my-ou                                                            │
│   TargetId: ou-941x-ad28nn1v                                             │
│   Type: ORGANIZATIONAL_UNIT                                              │
│   PolicyId: p-FullAWSAccess                                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: policy-attach::FullAWSAccess::myapp-uat                            │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Arn: arn:aws:organizations::840541460065:ou/o-xs8pjirjbw/ou-941x-kf4a… │
│   Name: myapp-uat                                                        │
│   TargetId: ou-941x-kf4a0pm7                                             │
│   Type: ORGANIZATIONAL_UNIT                                              │
│   PolicyId: p-FullAWSAccess                                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: policy-attach::FullAWSAccess::Root                                 │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Arn: arn:aws:organizations::840541460065:root/o-xs8pjirjbw/r-941x      │
│   Name: Root                                                             │
│   TargetId: r-941x                                                       │
│   Type: ROOT                                                             │
│   PolicyId: p-FullAWSAccess                                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: policy-attach::my-policy::my-ou                                    │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   Arn: arn:aws:organizations::840541460065:ou/o-xs8pjirjbw/ou-941x-ad28… │
│   Name: my-ou                                                            │
│   TargetId: ou-941x-ad28nn1v                                             │
│   Type: ORGANIZATIONAL_UNIT                                              │
│   PolicyId: p-8wt9duu3                                                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├─────────────────────────────────┬───────────────────────────────────────┤
│ Organisations::PolicyAttachment │ policy-attach::FullAWSAccess::161408… │
│                                 │ policy-attach::FullAWSAccess::my-ou   │
│                                 │ policy-attach::FullAWSAccess::Root    │
│                                 │ policy-attach::my-policy::my-ou       │
└─────────────────────────────────┴───────────────────────────────────────┘
9 resources, 1 type, 1 provider
Command "gc l -t Organisations::PolicyAttachment" executed in 8s, 101 MB
```
