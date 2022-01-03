---
id: DedicatedHost
title: DedicatedHost
---
Provides a **DedicatedHost** from the **Compute** group
## Examples
### Create or update a dedicated host .
```js
provider.Compute.makeDedicatedHost({
  name: "myDedicatedHost",
  properties: () => ({
    location: "westus",
    tags: { department: "HR" },
    properties: { platformFaultDomain: 1 },
    sku: { name: "DSv3-Type1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    hostGroup: resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
