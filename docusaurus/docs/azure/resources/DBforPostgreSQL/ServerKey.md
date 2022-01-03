---
id: ServerKey
title: ServerKey
---
Provides a **ServerKey** from the **DBforPostgreSQL** group
## Examples
### Creates or updates a PostgreSQL Server key
```js
provider.DBforPostgreSQL.makeServerKey({
  name: "myServerKey",
  properties: () => ({
    properties: {
      serverKeyType: "AzureKeyVault",
      uri: "https://someVault.vault.azure.net/keys/someKey/01234567890123456789012345678901",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server:
      resources.Network.P2sVpnServerConfiguration[
        "myP2sVpnServerConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [P2sVpnServerConfiguration](../Network/P2sVpnServerConfiguration.md)
## Misc
The resource version is `2020-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2020-01-01/DataEncryptionKeys.json).
