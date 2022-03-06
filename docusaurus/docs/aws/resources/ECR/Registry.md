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
