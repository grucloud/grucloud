---
id: ServiceAccount
title: Service Account
---

Provides a [Service Account](https://cloud.google.com/compute/docs/access/service-accounts):

```js
const sa = provider.iam.makeServiceAccount({
  name: "sa",
  properties: () => ({
    accountId: "sa-dev",
    displayName: "SA dev",
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm)

### Properties

- [all properties](https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts/create)

### Used By

- [Vm Instance](../compute/VmInstance.md)
- [IamMember](./Member.md)
