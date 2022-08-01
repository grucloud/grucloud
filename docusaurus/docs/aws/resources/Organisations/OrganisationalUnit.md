---
id: OrganisationalUnit
title: Organisational Unit
---

List an [Organisational Unit](https://console.aws.amazon.com/organizations/v2/home?#)

### Properties

- [CreateOrganizationalUnitCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/createorganizationalunitcommandinput.html)

### Used By

- [PrincipalAssociation](../RAM/PrincipalAssociation.md)

### List

```sh
gc l -t Organisations::OrganisationalUnit
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 2 Organisations::OrganisationalUnit from aws                                         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: grucloud-app                                                                   │
│ managedByUs: NO                                                                      │
│ live:                                                                                │
│   Arn: arn:aws:organizations::840541460064:ou/o-xs8pjirjbw/ou-941x-2jykk4xi          │
│   Id: ou-941x-2jykk4xi                                                               │
│   Name: grucloud-app                                                                 │
│   ParentId: r-941x                                                                   │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: myapp-uat                                                                      │
│ managedByUs: NO                                                                      │
│ live:                                                                                │
│   Arn: arn:aws:organizations::840541460064:ou/o-xs8pjirjbw/ou-941x-kf4a0pm7          │
│   Id: ou-941x-kf4a0pm7                                                               │
│   Name: myapp-uat                                                                    │
│   ParentId: r-941x                                                                   │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├───────────────────────────────────┬─────────────────────────────────────────────────┤
│ Organisations::OrganisationalUnit │ grucloud-app                                    │
│                                   │ myapp-uat                                       │
└───────────────────────────────────┴─────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t Organisations::OrganisationalUnit" executed in 6s, 112 MB
```
