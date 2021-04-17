---
id: NetworkAcl
title: Network Access Control List
---

List [Network Access Control List](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)

## List

List only the Network ACL with the _NetworkAcl_ filter:

```sh
gc l -t NetworkAcl
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkAcl from aws                                                                 │
├──────────────┬─────────────────────────────────────────────────────────────────┬──────┤
│ Name         │ Data                                                            │ Our  │
├──────────────┼─────────────────────────────────────────────────────────────────┼──────┤
│ acl-f57a5a9d │ Associations:                                                   │ NO   │
│              │   - NetworkAclAssociationId: aclassoc-0fce9c09b0776e224         │      │
│              │     NetworkAclId: acl-f57a5a9d                                  │      │
│              │     SubnetId: subnet-0f6f085fc384bf8ce                          │      │
│              │ Entries:                                                        │      │
│              │   - CidrBlock: 0.0.0.0/0                                        │      │
│              │     Egress: true                                                │      │
│              │     Protocol: -1                                                │      │
│              │     RuleAction: allow                                           │      │
│              │     RuleNumber: 100                                             │      │
│              │   - CidrBlock: 0.0.0.0/0                                        │      │
│              │     Egress: true                                                │      │
│              │     Protocol: -1                                                │      │
│              │     RuleAction: deny                                            │      │
│              │     RuleNumber: 32767                                           │      │
│              │   - CidrBlock: 0.0.0.0/0                                        │      │
│              │     Egress: false                                               │      │
│              │     Protocol: -1                                                │      │
│              │     RuleAction: allow                                           │      │
│              │     RuleNumber: 1                                               │      │
│              │   - CidrBlock: 0.0.0.0/0                                        │      │
│              │     Egress: false                                               │      │
│              │     Protocol: -1                                                │      │
│              │     RuleAction: allow                                           │      │
│              │     RuleNumber: 100                                             │      │
│              │   - CidrBlock: 0.0.0.0/0                                        │      │
│              │     Egress: false                                               │      │
│              │     Protocol: -1                                                │      │
│              │     RuleAction: deny                                            │      │
│              │     RuleNumber: 32767                                           │      │
│              │ IsDefault: true                                                 │      │
│              │ NetworkAclId: acl-f57a5a9d                                      │      │
│              │ Tags: []                                                        │      │
│              │ VpcId: vpc-bbbafcd3                                             │      │
│              │ OwnerId: 840541460064                                           │      │
│              │                                                                 │      │
└──────────────┴─────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├────────────────────┬─────────────────────────────────────────────────────────────────┤
│ NetworkAcl         │ acl-f57a5a9d                                                    │
└────────────────────┴─────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkAcl" executed in 2s
```
