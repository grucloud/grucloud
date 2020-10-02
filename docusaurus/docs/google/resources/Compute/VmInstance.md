---
id: VmInstance
title: VM Instance
---

Provides a Virtual Machine instance.

## Examples

### Simple VM

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

### Attach a public IP address

```js
const ip = await provider.makeAddress({
  name: `ip-webserver`,
});

const server = await provider.makeVmInstance({
  name: `webserver`,
  dependencies: { ip },
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

### Attach a service account

```js
const serviceAccount = await provider.makeServiceAccount({
  name: `sa-dev`,
  properties: () => ({
    serviceAccount: {
      displayName: "SA dev",
    },
  }),
});

// Allocate a server
const server = await provider.makeVmInstance({
  name: `webserver`,
  dependencies: { serviceAccount },
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

### Authenticate with a local SSH key pair

```js
const publicKey = fs.readFileSync(
  path.resolve(process.env.HOME, ".ssh/id_rsa.pub")
);

const ip = await provider.makeAddress({
  name: `ip-webserver-ssh-keys`,
});

const firewall22 = await provider.makeFirewall({
  name: `firewall-22`,
  properties: () => ({
    allowed: [
      {
        sourceRanges: ["0.0.0.0/0"],
        IPProtocol: "TCP",
        ports: [22],
      },
    ],
  }),
});

const server = await provider.makeVmInstance({
  name: `webserver-ssh-keys`,
  dependencies: { ip },
  properties: () => ({
    diskSizeGb: "20",
    machineType: "f1-micro",
    sourceImage:
      "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
    metadata: {
      items: [
        {
          key: "ssh-keys",
          value: `ubuntu:${publicKey}`,
        },
      ],
    },
  }),
});
```

### Authenticate with oslogin

```js
const server = await provider.makeVmInstance({
  name: `webserver`,
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

## Examples Code

- [basic example](https://github.com/grucloud/grucloud/blob/master/examples/google/vm/iac.js#L9)
- [VM with SSH keys in metadata](https://github.com/grucloud/grucloud/blob/master/examples/google/vm-ssh-keys/iac.js#L9)
- [full example](https://github.com/grucloud/grucloud/blob/master/examples/google/vm-network/iac.js#L9)

## Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/instances/insert#request-body)

## Dependencies

- [Address](./Address)
- [Service Account](../IAM/ServiceAccount)
