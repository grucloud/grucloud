---
id: Project
title: Project
---

Manages a [Project](https://cloud.google.com/resource-manager/reference/rest/v1/projects)

```js
const project = await provider.makeProject({ name: "myproject" });
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/iac.js)

### Properties

- [all properties](https://cloud.google.com/resource-manager/reference/rest/v1/projects/create)

### Used By

- [Vm Instance](./VmInstance)

### Gcloud CLI

```
gcloud organizations list

gcloud projects list
```
