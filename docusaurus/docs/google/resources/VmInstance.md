---
id: VmInstance
title: VM Instance
---

Provides a Virtual Machine instance:

```js
const server = await provider.makeVmInstance({
  name: "web-server",
  properties: () => ({
    diskSizeGb: "20",
    machineType: "f1-micro",
    sourceImage:
      "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
    metadata: {
      items: [
        {
          key: "enable-oslogin",
          value: "True",
        },
      ],
    },
  }),
});
```

To list the available source image:

```sh
gcloud compute images list
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/vm/iac.js#L9)
- [VM with SSH keys in metadata](https://github.com/FredericHeem/grucloud/blob/master/examples/google/vm-ssh-keys/iac.js#L9)
- [full example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/vm-network/iac.js#L9)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/instances/insert#request-body)

### Dependencies

- [Address](./Address)
- [Service Account](./ServiceAccount)
