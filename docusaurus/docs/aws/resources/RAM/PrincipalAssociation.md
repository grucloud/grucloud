---
id: PrincipalAssociation
title: Principal Association
---

Provides a [RAM Principal Association](https://console.aws.amazon.com/ram/home?#Home:)

```js
exports.createResources = () => [
  {
    type: "PrincipalAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "ipam-org-share",
      organisation: "fred@mail.com",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)
- [aws-network-hub](https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform)

### Properties

- [AssociateResourceShareCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/associateresourcesharecommandinput.html)

### Dependencies

- [RAM Resource Share](./ResourceShare.md)
- [IAM User](../IAM/User.md)
- [IAM Group](../IAM/Group.md)
- [Organisations Organisation](../Organisations/Organisation.md)
- [Organisations OrganisationalUnit](../Organisations/OrganisationalUnit.md)

### Used By

### List

```sh
gc l -t RAM::PrincipalAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 2 RAM::PrincipalAssociation from aws                                      │
├───────────────────────────────────────────────────────────────────────────┤
│ name: ram-principal-assoc::my-share::548529576214                         │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   associatedEntity: 548529576214                                          │
│   associationType: PRINCIPAL                                              │
│   creationTime: 2022-08-05T22:01:31.840Z                                  │
│   external: false                                                         │
│   lastUpdatedTime: 2022-08-05T22:01:33.319Z                               │
│   resourceShareArn: arn:aws:ram:us-east-1:840541460064:resource-share/12… │
│   resourceShareName: my-share                                             │
│   status: ASSOCIATED                                                      │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: ram-principal-assoc::my-share::arn:aws:organizations::840541460064… │
│ managedByUs: NO                                                           │
│ live:                                                                     │
│   associatedEntity: arn:aws:organizations::840541460064:organization/o-x… │
│   associationType: PRINCIPAL                                              │
│   creationTime: 2022-08-05T22:01:31.799Z                                  │
│   external: false                                                         │
│   lastUpdatedTime: 2022-08-05T22:01:33.236Z                               │
│   resourceShareArn: arn:aws:ram:us-east-1:840541460064:resource-share/12… │
│   resourceShareName: my-share                                             │
│   status: ASSOCIATED                                                      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────────────────┬──────────────────────────────────────────────┤
│ RAM::PrincipalAssociation │ ram-principal-assoc::my-share::548529576214  │
│                           │ ram-principal-assoc::my-share::arn:aws:orga… │
└───────────────────────────┴──────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t RAM::PrincipalAssociation" executed in 4s, 104 MB
```
