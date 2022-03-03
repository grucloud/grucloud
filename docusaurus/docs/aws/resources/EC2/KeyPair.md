---
title: KeyPair
---

Provide a reference to an SSH key pair, used to connect to EC2 instances.

See the [AWS documentation for ec2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) to create a new one.

```js
exports.createResources = () => [
  { type: "KeyPair", group: "EC2", name: "kp-ecs" },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/keyPair)

### Used By

- [EC2](./Instance.md)

### List

List the available key pairs:

```bash
gc list -t KeyPair
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────┐
│ 1 EC2::KeyPair from aws                                       │
├───────────────────────────────────────────────────────────────┤
│ name: kp                                                      │
│ managedByUs: Yes                                              │
│ live:                                                         │
│   KeyPairId: key-0e6bc70ddde611e0c                            │
│   KeyFingerprint: a7:08:53:0d:22:e2:90:5b:43:c3:62:9b:c5:23:… │
│   KeyName: kp                                                 │
│   KeyType: rsa                                                │
│   Tags:                                                       │
│     - Key: gc-created-by-provider                             │
│       Value: aws                                              │
│     - Key: gc-managed-by                                      │
│       Value: grucloud                                         │
│     - Key: gc-project-name                                    │
│       Value: @grucloud/example-aws-ec2-keypair                │
│     - Key: gc-stage                                           │
│       Value: dev                                              │
│     - Key: Name                                               │
│       Value: kp                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────┐
│ aws                                                          │
├──────────────┬───────────────────────────────────────────────┤
│ EC2::KeyPair │ kp                                            │
└──────────────┴───────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t KeyPair" executed in 2s
```
