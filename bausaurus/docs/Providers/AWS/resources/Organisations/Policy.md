---
id: Policy
title: Policy
---

Provides an [Organisation Policy](https://console.aws.amazon.com/organizations/v2/home?#)

Create a service control policy:

```js
exports.createResources = () => [
  {
    type: "Policy",
    group: "Organisations",
    properties: ({}) => ({
      Content: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "Statement2",
            Effect: "Allow",
            Action: ["*"],
            Resource: ["*"],
          },
        ],
      },
      Description: "",
      Name: "my-policy",
      Type: "SERVICE_CONTROL_POLICY",
    }),
  },
];
```

Create a tag policy:

```js
exports.createResources = () => [
  {
    type: "Policy",
    group: "Organisations",
    properties: ({}) => ({
      Content: {
        tags: {
          env: {
            tag_value: {
              "@@assign": ["prod", "dev"],
            },
          },
        },
      },
      Description: "My tag policy",
      Name: "my-tag-policy",
      Type: "TAG_POLICY",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/Organisation/organisations-policy)

### Properties

- [CreatePolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/createpolicycommandinput.html)

### Dependencies

### Used By

- [Organisation Policy Attachment](./PolicyAttachment.md)

### List

```sh
gc l -t Organisations::Policy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 2 Organisations::Policy from aws                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ name: FullAWSAccess                                                      │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   PolicyId: p-FullAWSAccess                                              │
│   Content:                                                               │
│     Version: 2012-10-17                                                  │
│     Statement:                                                           │
│       - Effect: Allow                                                    │
│         Action: *                                                        │
│         Resource: *                                                      │
│   Arn: arn:aws:organizations::aws:policy/service_control_policy/p-FullA… │
│   AwsManaged: true                                                       │
│   Description: Allows access to every operation                          │
│   Name: FullAWSAccess                                                    │
│   Type: SERVICE_CONTROL_POLICY                                           │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-policy                                                          │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   PolicyId: p-8wt9duu3                                                   │
│   Content:                                                               │
│     Version: 2012-10-17                                                  │
│     Statement:                                                           │
│       - Sid: Statement2                                                  │
│         Effect: Allow                                                    │
│         Action:                                                          │
│           - "*"                                                          │
│         Resource:                                                        │
│           - "*"                                                          │
│   Arn: arn:aws:organizations::840541460064:policy/o-xs8pjirjbw/service_… │
│   AwsManaged: false                                                      │
│   Description:                                                           │
│   Name: my-policy                                                        │
│   Type: SERVICE_CONTROL_POLICY                                           │
│   Tags:                                                                  │
│     - Key: gc-created-by-provider                                        │
│       Value: aws                                                         │
│     - Key: gc-managed-by                                                 │
│       Value: grucloud                                                    │
│     - Key: gc-project-name                                               │
│       Value: organisations-policy                                        │
│     - Key: gc-stage                                                      │
│       Value: dev                                                         │
│     - Key: Name                                                          │
│       Value: my-policy                                                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────┬─────────────────────────────────────────────────┤
│ Organisations::Policy │ FullAWSAccess                                   │
│                       │ my-policy                                       │
└───────────────────────┴─────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t Organisations::Policy" executed in 3s, 104 MB
```
