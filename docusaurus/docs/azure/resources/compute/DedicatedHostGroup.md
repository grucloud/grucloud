---
id: DedicatedHostGroup
title: DedicatedHostGroup
---
Provides a **DedicatedHostGroup** from the **Compute** group
## Examples
### Create or update a dedicated host group.
```js
provider.Compute.makeDedicatedHostGroup({
  name: "myDedicatedHostGroup",
  properties: () => ({
    location: "westus",
    tags: { department: "finance" },
    zones: ["1"],
    properties: {
      platformFaultDomainCount: 3,
      supportAutomaticPlacement: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
