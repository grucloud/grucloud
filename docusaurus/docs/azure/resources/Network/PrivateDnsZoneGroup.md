---
id: PrivateDnsZoneGroup
title: PrivateDnsZoneGroup
---
Provides a **PrivateDnsZoneGroup** from the **Network** group
## Examples
### Create private dns zone group
```js
provider.Network.makePrivateDnsZoneGroup({
  name: "myPrivateDnsZoneGroup",
  properties: () => ({
    properties: {
      privateDnsZoneConfigs: [
        {
          properties: {
            privateDnsZoneId:
              "/subscriptions/subId/resourceGroups/rg1/providers/Microsoft.Network/privateDnsZones/zone1.com",
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpoint: resources.Network.PrivateEndpoint["myPrivateEndpoint"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/privateEndpoint.json).
