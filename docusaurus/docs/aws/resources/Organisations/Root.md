---
id: Root
title: Root
---

List an [Organisations Root](https://console.aws.amazon.com/organizations/v2/home?#)

### Used By

- [OrganizationalUnit](./OrganisationalUnit.md)

### List

```sh
gc l -t Root
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Organisations::Root from aws                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: Root                                                                           │
│ managedByUs: NO                                                                      │
│ live:                                                                                │
│   Arn: arn:aws:organizations::840541460064:root/o-xs8pjirjbw/r-941x                  │
│   Id: r-941x                                                                         │
│   Name: Root                                                                         │
│   PolicyTypes: []                                                                    │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├─────────────────────┬───────────────────────────────────────────────────────────────┤
│ Organisations::Root │ Root                                                          │
└─────────────────────┴───────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Root" executed in 7s, 117 MB
```
