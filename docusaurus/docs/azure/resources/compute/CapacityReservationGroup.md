---
id: CapacityReservationGroup
title: CapacityReservationGroup
---
Provides a **CapacityReservationGroup** from the **Compute** group
## Examples
### Create or update a capacity reservation group.
```js
provider.Compute.makeCapacityReservationGroup({
  name: "myCapacityReservationGroup",
  properties: () => ({
    location: "westus",
    tags: { department: "finance" },
    zones: ["1", "2"],
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
