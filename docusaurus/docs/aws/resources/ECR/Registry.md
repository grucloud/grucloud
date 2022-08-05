---
id: Registry
title: Registry
---

Manages a [Docker Registry](https://console.aws.amazon.com/ecr/home)

## Sample Code

The following code describes a repository with a policy and a replication configuration:

```js
exports.createResources = () => [
  {
    type: "Registry",
    group: "ECR",
    name: "default",
    properties: ({ config }) => ({
      policyText: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "stis-1",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: ["ecr:CreateRepository", "ecr:ReplicateImage"],
            Resource: `arn:aws:ecr:${
              config.region
            }:${config.accountId()}:repository/*`,
          },
        ],
      },
      replicationConfiguration: {
        rules: [
          {
            destinations: [
              {
                region: "us-east-2",
                registryId: config.accountId(),
              },
            ],
          },
        ],
      },
    }),
  },
];
```

### Full Examples

- [Registry and Repository](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECR/repository)

### Properties

- [PutRegistryPolicyCommandInput properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecr/interfaces/putregistrypolicycommandinput.html)
- [PutReplicationConfigurationCommandInput properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecr/interfaces/putreplicationconfigurationcommandinput.html)

### List

```sh
gc l -t ECR::Registry
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 ECR::Registry from aws                                                  │
├───────────────────────────────────────────────────────────────────────────┤
│ name: default                                                             │
│ managedByUs: NO                                                           │
│ live:                                                                     │
│   registryId: 840541460064                                                │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────┬──────────────────────────────────────────────────────────┤
│ ECR::Registry │ default                                                  │
└───────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ECR::Registry" executed in 4s, 100 MB
```
