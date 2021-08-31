---
id: KmsKey
title: Kms Key
---

Manages a [Customer Master Key](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#master_keys).

## Example

### Symmetric key

Create a symmetric key, for instance used by an [EKS Cluster](../EKS/EksCluster)

```js
const cmk = provider.KMS.makeKey({
  name: "my-secret-key",
  properties: () => ({}),
});
```

## Code Examples

- [simple symmetric key](https://github.com/grucloud/grucloud/blob/main/examples/aws/kms/symmetric/iac.js)
- [symmetric key used by an EKS cluster](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/kms/eks/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property)

## Used By

- [EKSCluster](../EKS/EksCluster)

## List

```sh
gc l -t Key
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ 1  Key from …   │                                                                           │
├─────────────────┼────────────────────────────────────────────────────────────────────┬──────┤
│ Name            │ Data                                                               │ Our  │
├─────────────────┼────────────────────────────────────────────────────────────────────┼──────┤
│ secret-key-test │ AWSAccountId: 840541460064                                         │ Yes  │
│                 │ KeyId: cf8639e0-25d1-46d2-86eb-d2761e8d556d                        │      │
│                 │ Arn: arn:aws:kms:eu-west-2:840541460064:key/cf8639e0-25d1-46d2-86… │      │
│                 │ CreationDate: 2021-06-08T16:39:23.024Z                             │      │
│                 │ Enabled: true                                                      │      │
│                 │ Description:                                                       │      │
│                 │ KeyUsage: ENCRYPT_DECRYPT                                          │      │
│                 │ KeyState: Enabled                                                  │      │
│                 │ Origin: AWS_KMS                                                    │      │
│                 │ KeyManager: CUSTOMER                                               │      │
│                 │ CustomerMasterKeySpec: SYMMETRIC_DEFAULT                           │      │
│                 │ EncryptionAlgorithms:                                              │      │
│                 │   - "SYMMETRIC_DEFAULT"                                            │      │
│                 │ Tags:                                                              │      │
│                 │   - TagKey: CreatedByProvider                                      │      │
│                 │     TagValue: aws                                                  │      │
│                 │   - TagKey: ManagedBy                                              │      │
│                 │     TagValue: GruCloud                                             │      │
│                 │   - TagKey: Name                                                   │      │
│                 │     TagValue: secret-key-test                                      │      │
│                 │   - TagKey: projectName                                            │      │
│                 │     TagValue: kms-symmetric                                        │      │
│                 │   - TagKey: stage                                                  │      │
│                 │     TagValue: dev                                                  │      │
│                 │ Alias: alias/secret-key-test                                       │      │
│                 │                                                                    │      │
└─────────────────┴────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                        │
├────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ Key                │ secret-key-test                                                       │
└────────────────────┴───────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Key" executed in 2s
```
