---
id: Key
title: Key
---

Manages a [Customer Master Key](https://console.aws.amazon.com/kms/home?#/kms/keys).

## Example

### Symmetric key

Create a symmetric key, for instance used by an [EKS Cluster](../EKS/Cluster.md)

```js
exports.createResources = () => [
  {
    type: "Key",
    group: "KMS",
    name: "kms-key-aws-hub-and-spoke-demo-test",
    properties: ({ config }) => ({
      Description: "KMS Logs Key",
      Policy: {
        Version: "2012-10-17",
        Id: "key-default-1",
        Statement: [
          {
            Sid: "Enable IAM User Permissions",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: "kms:*",
            Resource: `*`,
          },
          {
            Sid: "Enable KMS to be used by CloudWatch Logs",
            Effect: "Allow",
            Principal: {
              Service: `logs.${config.region}.amazonaws.com`,
            },
            Action: [
              "kms:Encrypt*",
              "kms:Decrypt*",
              "kms:ReEncrypt*",
              "kms:GenerateDataKey*",
              "kms:Describe*",
            ],
            Resource: `*`,
          },
        ],
      },
    }),
  },
];
```

## Code Examples

- [simple symmetric key](https://github.com/grucloud/grucloud/blob/main/examples/aws/kms/symmetric/resources.js)

## Properties

- [CreateKeyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kms/interfaces/createkeycommandinput.html)

## Used By

- [EKS Cluster](../EKS/Cluster.md)
- [CloudWatch LogGroup](../CloudWatchLogs/LogGroup.md)
- [SNS Topic](../SNS/Topic.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)

## List

```sh
gc l -t Key
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────┐
│ 8 KMS::Key from aws                                                   │
├───────────────────────────────────────────────────────────────────────┤
│ name: alias/aws/acm                                                   │
│ managedByUs: NO                                                       │
│ live:                                                                 │
│   AWSAccountId: 548529576214                                          │
│   Arn: arn:aws:kms:us-east-1:548529576214:key/46844236-3719-4f30-88b… │
│   CreationDate: 2022-05-04T19:28:57.475Z                              │
│   CustomerMasterKeySpec: SYMMETRIC_DEFAULT                            │
│   Description: Default key that protects my ACM private keys when no… │
│   Enabled: true                                                       │
│   EncryptionAlgorithms:                                               │
│     - "SYMMETRIC_DEFAULT"                                             │
│   KeyId: 46844236-3719-4f30-88b2-a70e2671ca8e                         │
│   KeyManager: AWS                                                     │
│   KeySpec: SYMMETRIC_DEFAULT                                          │
│   KeyState: Enabled                                                   │
│   KeyUsage: ENCRYPT_DECRYPT                                           │
│   MultiRegion: false                                                  │
│   Origin: AWS_KMS                                                     │
│   Policy:                                                             │
│     Version: 2012-10-17                                               │
│     Id: auto-acm-4                                                    │
│     Statement:                                                        │
│       - Sid: Allow creation of decryption grants                      │
│         Effect: Allow                                                 │
│         Principal:                                                    │
│           AWS: *                                                      │
│         Action: kms:CreateGrant                                       │
│         Resource: *                                                   │
│         Condition:                                                    │
│           StringEquals:                                               │
│             kms:CallerAccount: 548529576214                           │
│             kms:ViaService: acm.us-east-1.amazonaws.com               │
│           ForAllValues:StringEquals:                                  │
│             kms:GrantOperations: Decrypt                              │
│           Bool:                                                       │
│             kms:GrantIsForAWSResource: true                           │
│       - Sid: Allow creation of encryption grant                       │
│         Effect: Allow                                                 │
│         Principal:                                                    │
│           AWS: *                                                      │
│         Action: kms:CreateGrant                                       │
│         Resource: *                                                   │
│         Condition:                                                    │
│           StringEquals:                                               │
│             kms:CallerAccount: 548529576214                           │
│             kms:ViaService: acm.us-east-1.amazonaws.com               │
│           ForAllValues:StringEquals:                                  │
│             kms:GrantOperations:                                      │
│               - "Encrypt"                                             │
│               - "ReEncryptFrom"                                       │
│               - "ReEncryptTo"                                         │
│           Bool:                                                       │
│             kms:GrantIsForAWSResource: true                           │
│       - Sid: Allowed operations for the key owner                     │
│         Effect: Allow                                                 │
│         Principal:                                                    │
│           AWS: *                                                      │
│         Action:                                                       │
│           - "kms:DescribeKey"                                         │
│           - "kms:ListGrants"                                          │
│           - "kms:RevokeGrant"                                         │
│           - "kms:GetKeyPolicy"                                        │
│         Resource: *                                                   │
│         Condition:                                                    │
│           StringEquals:                                               │
│             kms:CallerAccount: 548529576214                           │
│       - Sid: Deny re-encryption to any other key                      │
│         Effect: Deny                                                  │
│         Principal:                                                    │
│           AWS: *                                                      │
│         Action: kms:ReEncrypt*                                        │
│         Resource: *                                                   │
│         Condition:                                                    │
│           Bool:                                                       │
│             kms:ReEncryptOnSameKey: false                             │
│       - Sid: Allow decrypt                                            │
│         Effect: Allow                                                 │
│         Principal:                                                    │
│           AWS: *                                                      │
│         Action: kms:Decrypt                                           │
│         Resource: *                                                   │
│         Condition:                                                    │
│           StringEquals:                                               │
│             kms:CallerAccount: 548529576214                           │
│             kms:ViaService: acm.us-east-1.amazonaws.com               │
│   Alias: alias/aws/acm                                                │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤

```
