---
id: DiskAccessAPrivateEndpointConnection
title: DiskAccessAPrivateEndpointConnection
---
Provides a **DiskAccessAPrivateEndpointConnection** from the **Compute** group
## Examples
### Approve a Private Endpoint Connection under a disk access resource.
```js
provider.Compute.makeDiskAccessAPrivateEndpointConnection({
  name: "myDiskAccessAPrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "Approving myPrivateEndpointConnection",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DiskAccess](../Compute/DiskAccess.md)
## Misc
The resource version is `2021-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-04-01/disk.json).
