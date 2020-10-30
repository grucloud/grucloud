---
id: IamBinding
title: IAM Binding
---

Provides a IAM Binding for a project.

## Examples

### Bind a user to a role

```js
const iamBinding = await provider.makeIamBinding({
  name: "roles/editor",
  properties: () => ({
    members: ["user:jane@example.com"],
  }),
});
```

### Bind a service account to a role

```js
const serviceAccount = await provider.makeServiceAccount({
  name: "sa",
  properties: () => ({
    accountId: "sa",
  }),
});

const iamBinding = await provider.makeIamBinding({
  name: "roles/editor",
  dependencies: { serviceAccounts: [serviceAccount] },
  properties: ({}) => ({}),
});
```

### Example Code

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/iam/iam-binding/iac.js#L7)

### Used By

- [ServiceAccount](../Compute/ServiceAccount)
