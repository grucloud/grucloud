---
id: Organisation
title: Organisation
---

Provides an [Organisation](https://console.aws.amazon.com/organizations/v2/home?#)

```js
exports.createResources = () => [
  {
    type: "Organisation",
    group: "Organisations",
    name: "mario@mail.com",
    readOnly: true,
    properties: ({}) => ({
      AvailablePolicyTypes: [
        {
          Status: "ENABLED",
          Type: "SERVICE_CONTROL_POLICY",
        },
      ],
      FeatureSet: "ALL",
      MasterAccountEmail: "mario@mail.com",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)

### Properties

- [CreateOrganizationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/createorganizationcommandinput.html)

### Dependencies

### Used By

- [PrincipalAssociation](../RAM/PrincipalAssociation.md)

### List

```sh
gc l -t Organisation
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Organisations::Organisation from aws                                             │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: fredy@mail.com                                                     │
│ managedByUs: NO                                                                    │
│ live:                                                                              │
│   Arn: arn:aws:organizations::840541460064:organization/o-xs8pjirjbw               │
│   AvailablePolicyTypes:                                                            │
│     - Status: ENABLED                                                              │
│       Type: SERVICE_CONTROL_POLICY                                                 │
│   FeatureSet: ALL                                                                  │
│   Id: o-xs8pjirjbw                                                                 │
│   MasterAccountArn: arn:aws:organizations::840541460064:account/o-xs8pjirjbw/8405… │
│   MasterAccountEmail: fredy@mail.com                                     │
│   MasterAccountId: 840541460064                                                    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├─────────────────────────────┬─────────────────────────────────────────────────────┤
│ Organisations::Organisation │ fredy@mail.com                            │
└─────────────────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Organisation" executed in 4s, 106 MB
```
