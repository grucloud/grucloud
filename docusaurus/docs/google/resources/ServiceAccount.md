---
id: ServiceAccount
title: Service Account
---

Provides a [Service Account](https://cloud.google.com/compute/docs/access/service-accounts):

```js
const sa = await provider.makeServiceAccount({
  name: "sa",
  propertie: () => ({
    accountId: "sa-dev",
    displayName: "SA dev",
  }),
});
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/iac.js)

### Properties

- [all properties](https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts/create)

### Used By

- [Vm Instance](./VmInstance)
