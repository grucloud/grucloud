---
id: CapacityReservation
title: CapacityReservation
---
Provides a **CapacityReservation** from the **Compute** group
## Examples
### Create or update a capacity reservation .
```js
provider.Compute.makeCapacityReservation({
  name: "myCapacityReservation",
  properties: () => ({
    location: "westus",
    tags: { department: "HR" },
    sku: { name: "Standard_DS1_v2", capacity: 4 },
    zones: ["1"],
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
