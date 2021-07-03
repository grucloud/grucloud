---
id: IamMember
title: IAM Member
---

Provides a IAM Member for a project.

```js
const serviceAccount = await provider.iam.makeServiceAccount({
  name: "sa",
  propertie: () => ({
    accountId: "sa-dev",
    displayName: "SA dev",
  }),
});

const iamMember = await provider.makeProjectIamMember({
  name: "iam-member",
  dependencies: { serviceAccount },
  properties: () => ({
    roles: ["roles/storage.objectViewer", "roles/logging.logWriter"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/iam/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/addresses/insert#request-body)

### Used By

- [ServiceAccount](./ServiceAccount)
