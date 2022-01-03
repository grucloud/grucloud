---
id: ProximityPlacementGroup
title: ProximityPlacementGroup
---
Provides a **ProximityPlacementGroup** from the **Compute** group
## Examples
### Create or Update a proximity placement group.
```js
provider.Compute.makeProximityPlacementGroup({
  name: "myProximityPlacementGroup",
  properties: () => ({
    location: "westus",
    properties: { proximityPlacementGroupType: "Standard" },
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
