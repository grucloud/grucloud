---
id: Binding
title: Binding
---

Provides a IAM Binding for a project.

## Examples

### Bind a user to a role

```js
const iamBinding = provider.iam.makeBinding({
  name: "roles/editor",
  properties: () => ({
    members: ["user:jane@example.com"],
  }),
});
```

### Bind a service account to a role

```js
const serviceAccount = provider.iam.makeServiceAccount({
  name: "sa",
  properties: () => ({
    accountId: "sa",
  }),
});

const iamBinding = provider.iam.makeBinding({
  name: "roles/editor",
  dependencies: () => ({ serviceAccounts: ["sa"] }),
});
```

### Example Code

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/iam/iam-binding/iac.js#L7)

### Used By

- [ServiceAccount](./ServiceAccount.md)
