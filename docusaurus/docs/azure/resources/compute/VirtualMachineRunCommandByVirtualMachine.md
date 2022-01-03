---
id: VirtualMachineRunCommandByVirtualMachine
title: VirtualMachineRunCommandByVirtualMachine
---
Provides a **VirtualMachineRunCommandByVirtualMachine** from the **Compute** group
## Examples
### Create or update a run command.
```js
provider.Compute.makeVirtualMachineRunCommandByVirtualMachine({
  name: "myVirtualMachineRunCommandByVirtualMachine",
  properties: () => ({
    location: "West US",
    properties: {
      source: { script: "Write-Host Hello World!" },
      parameters: [
        { name: "param1", value: "value1" },
        { name: "param2", value: "value2" },
      ],
      asyncExecution: false,
      runAsUser: "user1",
      runAsPassword: "<runAsPassword>",
      timeoutInSeconds: 3600,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vm: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/runCommands.json).
