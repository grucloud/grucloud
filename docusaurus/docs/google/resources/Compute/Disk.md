---
id: Disk
title: Disk
---

Manages a [Peristent Disk](https://cloud.google.com/compute/docs/disks#pdspecs)

Create a disk and attach it to a virtual machine:

```js
const disk = provider.compute.makeDisk({
  name: `my-disk`,
  properties: () => ({
    sizeGb: "50",
  }),
});

const server = provider.compute.makeVmInstance({
  name: `webserver`,
  dependencies: {
    disks: [disk],
  },
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

### Examples

- [create and attach a disk to an instance](https://github.com/grucloud/grucloud/blob/main/examples/google/vm/iac.js)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/disks/insert)

### Used By

- [VmInstance](./VmInstance.md)
