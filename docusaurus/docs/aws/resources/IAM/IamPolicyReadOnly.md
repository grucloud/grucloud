---
id: IamPolicyReadOnly
title: Iam Policy Read Only
---

Provides an Iam Read Only Policy.

The examples below uses a read only policy and add it to a role, a user or a group.

### Attach an existing policy to a role

```js
const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
  name: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
});

const iamRole = await provider.makeIamRole({
  name: "eks-role",
  dependencies: { policies: [iamPolicyEKSCluster] },
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: "eks.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      ],
    },
  }),
});
```

### Examples

- [eks example](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js)

### Used By

- [IamRole](./IamRole)
- [IamUser](./IamUser)
- [IamGroup](./IamGroup)
