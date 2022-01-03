---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **KeyVault** group
## Examples
### KeyVaultPutPrivateEndpointConnection
```js
provider.KeyVault.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    etag: "",
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "My name is Joe and I'm approving this.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vault: resources.KeyVault.Vault["myVault"],
    mhsmPrivateEndpointConnection:
      resources.KeyVault.MHSMPrivateEndpointConnection[
        "myMHSMPrivateEndpointConnection"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Vault](../KeyVault/Vault.md)
- [MHSMPrivateEndpointConnection](../KeyVault/MHSMPrivateEndpointConnection.md)
## Misc
The resource version is `2021-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/keyvault.json).
