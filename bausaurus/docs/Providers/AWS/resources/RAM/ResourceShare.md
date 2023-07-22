---
id: ResourceShare
title: Resource Share
---

Provides a [RAM Resource Share](https://console.aws.amazon.com/ram/home?#Home:)

```js
exports.createResources = () => [
  {
    type: "ResourceShare",
    group: "RAM",
    properties: ({}) => ({
      allowExternalPrincipals: false,
      featureSet: "STANDARD",
      name: "ipam-org-share",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)
- [aws-network-hub](https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform)

### Properties

- [CreateResourceShareCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/createresourcesharecommandinput.html)

### Dependencies

### Used By

- [RAM Resource Association](../RAM/ResourceAssociation.md)
- [RAM Principal Association](../RAM/PrincipalAssociation.md)

### List

```sh
gc l -t RAM::ResourceShare
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 RAM::ResourceShare from aws                                             │
├───────────────────────────────────────────────────────────────────────────┤
│ name: my-share                                                            │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   allowExternalPrincipals: false                                          │
│   creationTime: 2022-08-05T22:01:29.757Z                                  │
│   featureSet: STANDARD                                                    │
│   lastUpdatedTime: 2022-08-05T22:01:29.757Z                               │
│   name: my-share                                                          │
│   owningAccountId: 840541460064                                           │
│   resourceShareArn: arn:aws:ram:us-east-1:840541460064:resource-share/12… │
│   status: ACTIVE                                                          │
│   tags:                                                                   │
│     - key: gc-created-by-provider                                         │
│       value: aws                                                          │
│     - key: gc-managed-by                                                  │
│       value: grucloud                                                     │
│     - key: gc-project-name                                                │
│       value: resource-share                                               │
│     - key: gc-stage                                                       │
│       value: dev                                                          │
│     - key: Name                                                           │
│       value: my-share                                                     │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────────┬─────────────────────────────────────────────────────┤
│ RAM::ResourceShare │ my-share                                            │
└────────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t RAM::ResourceShare" executed in 5s, 104 MB
```
