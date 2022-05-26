---
id: VmInstance
title: VM Instance
---

Provides a Virtual Machine instance.

## Examples

### Simple VM

```js
provider.compute.makeVmInstance({
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
provider.compute.makeAddress({
  name: `ip-webserver`,
});

const server = provider.compute.makeVmInstance({
  name: `webserver`,
  dependencies: { ip: `ip-webserver` },
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
provider.iam.makeServiceAccount({
  name: `sa-dev`,
  properties: () => ({
    serviceAccount: {
      displayName: "SA dev",
    },
  }),
});

// Allocate a server
const server = provider.compute.makeVmInstance({
  name: `webserver`,
  dependencies: () => ({ serviceAccount: `sa-dev` }),
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

const ip = provider.compute.makeAddress({
  name: `ip-webserver-ssh-keys`,
});

const firewall22 = provider.compute.makeFirewall({
  name: `firewall-22`,
  properties: () => ({
    allowed: [
      {
        IPProtocol: "tcp",
        ports: ["22"],
      },
    ],
  }),
});

const server = provider.compute.makeVmInstance({
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
const server = provider.compute.makeVmInstance({
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

### VM Intance into a specific network

```js
// Vpc network
const network = provider.compute.makeNetwork({
  name: `vpc`,
  properties: () => ({ autoCreateSubnetworks: false }),
});

// Subnetwork
const subNetwork = provider.ec2.makeSubnetwork({
  name: `subnetwork`,
  dependencies: { network },
  properties: () => ({
    ipCidrRange: "10.164.0.0/20",
  }),
});

// Allocate a server
const server = provider.compute.makeVmInstance({
  name: `my-server`,
  dependencies: { subNetwork },
  properties: () => ({
    sourceImage:
      "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
  }),
});
```

## Examples Code

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm)
- [VM with SSH keys in metadata](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-ssh-keys)
- [full example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-network)

## Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/instances/insert#request-body)

## Dependencies

- [Address](./Address.md)
- [Service Account](../iam/ServiceAccount.md)
- [SubNetwork](./SubNetwork.md)
- [Disk](./Disk.md)
