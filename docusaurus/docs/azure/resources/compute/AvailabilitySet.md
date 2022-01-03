---
id: AvailabilitySet
title: AvailabilitySet
---
Provides a **AvailabilitySet** from the **Compute** group
## Examples
### Create an availability set.
```js
provider.Compute.makeAvailabilitySet({
  name: "myAvailabilitySet",
  properties: () => ({
    location: "westus",
    properties: { platformFaultDomainCount: 2, platformUpdateDomainCount: 20 },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
