---
id: MHSMPrivateEndpointConnection
title: MHSMPrivateEndpointConnection
---
Provides a **MHSMPrivateEndpointConnection** from the **KeyVault** group
## Examples
### ManagedHsmPutPrivateEndpointConnection
```js
provider.KeyVault.makeMHSMPrivateEndpointConnection({
  name: "myMHSMPrivateEndpointConnection",
  properties: () => ({
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "My name is Joe and I'm approving this.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    privateEndpointConnection:
      resources.KeyVault.PrivateEndpointConnection[
        "myPrivateEndpointConnection"
      ],
    name: resources.KeyVault.ManagedHsm["myManagedHsm"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpointConnection](../KeyVault/PrivateEndpointConnection.md)
- [ManagedHsm](../KeyVault/ManagedHsm.md)
## Misc
The resource version is `2021-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/managedHsm.json).
