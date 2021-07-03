---
id: ServiceAccount
title: Service Account
---

Provides a [Service Account](https://cloud.google.com/compute/docs/access/service-accounts):

```js
const sa = await provider.iam.makeServiceAccount({
  name: "sa",
  properties: () => ({
    accountId: "sa-dev",
    displayName: "SA dev",
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm/iac.js)

### Properties

- [all properties](https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts/create)

### Used By

- [Vm Instance](../Compute/VmInstance)
- [IamMember](./IamMember)
