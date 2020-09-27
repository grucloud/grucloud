---
id: IamBinding
title: IAM Binding
---

Provides a IAM Binding for a project.

```js
const iamBinding = await provider.makeIamBinding({
  name: "iam-binding-role-editor",
  properties: () => ({
    role: "roles/editor",
    members: ["user:jane@example.com"],
  }),
});
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/iam/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/addresses/insert#request-body)

### Used By

- [ServiceAccount](../Compute/ServiceAccount)
