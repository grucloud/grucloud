---
id: VirtualMachine
title: Virtual Machine
---

Provides a Virtual Machine:

```js
const { MACHINE_ADMIN_USERNAME, MACHINE_ADMIN_PASSWORD } = process.env;

const vm = await provider.makeVirtualMachine({
  name: `vm`,
  dependencies: {
    resourceGroup,
    networkInterface,
  },
  properties: {
    properties: {
      hardwareProfile: {
        vmSize: "Standard_A1_v2",
      },
      storageProfile: {
        imageReference: {
          offer: "UbuntuServer",
          publisher: "Canonical",
          sku: "18.04-LTS",
          version: "latest",
        },
      },
      osProfile: {
        adminUsername: MACHINE_ADMIN_USERNAME,
        computerName: "myVM",
        adminPassword: MACHINE_ADMIN_PASSWORD,
      },
    },
  },
});
```

Retrieve the list of all possible virtual machine on a given location:

```sh
az vm list-sizes  --output table --location uksouth
```

Regarding the _imageReference_, execute this command and select the desired image:

```sh
az vm image list  --output table
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/azure/iac.js#L97)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/compute/virtualmachines/createorupdate#request-body)

### Dependencies

- [ResourceGroup](./ResourceGroup)
- [NetworkInterface](./NetworkInterface)
