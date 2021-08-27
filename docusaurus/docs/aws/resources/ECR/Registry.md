---
id: Registry
title: Registry
---

Manages a Docker Registry.

## Sample Code

```js
provider.ecr.makeRepository({
  name: "my-registry",
  properties: ({ config }) => ({
    policyText: {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "st-1",
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
              region: "us-east-1",
              registryId: config.accountId(),
            },
          ],
        },
      ],
    },
  }),
});
```

### Full Examples

- [Registry and Repository](https://github.com/grucloud/grucloud/tree/main/examples/aws/ecr/repository)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property)

### Used By

- [Repository](./Repository)
