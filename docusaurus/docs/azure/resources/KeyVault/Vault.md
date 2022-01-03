---
id: Vault
title: Vault
---
Provides a **Vault** from the **KeyVault** group
## Examples
### Create a new vault or update an existing vault
```js
provider.KeyVault.makeVault({
  name: "myVault",
  properties: () => ({
    location: "westus",
    properties: {
      tenantId: "00000000-0000-0000-0000-000000000000",
      sku: { family: "A", name: "standard" },
      accessPolicies: [
        {
          tenantId: "00000000-0000-0000-0000-000000000000",
          objectId: "00000000-0000-0000-0000-000000000000",
          permissions: {
            keys: [
              "encrypt",
              "decrypt",
              "wrapKey",
              "unwrapKey",
              "sign",
              "verify",
              "get",
              "list",
              "create",
              "update",
              "import",
              "delete",
              "backup",
              "restore",
              "recover",
              "purge",
            ],
            secrets: [
              "get",
              "list",
              "set",
              "delete",
              "backup",
              "restore",
              "recover",
              "purge",
            ],
            certificates: [
              "get",
              "list",
              "delete",
              "create",
              "import",
              "update",
              "managecontacts",
              "getissuers",
              "listissuers",
              "setissuers",
              "deleteissuers",
              "manageissuers",
              "recover",
              "purge",
            ],
          },
        },
      ],
      enabledForDeployment: true,
      enabledForDiskEncryption: true,
      enabledForTemplateDeployment: true,
      publicNetworkAccess: "Enabled",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create or update a vault with network acls
```js
provider.KeyVault.makeVault({
  name: "myVault",
  properties: () => ({
    location: "westus",
    properties: {
      tenantId: "00000000-0000-0000-0000-000000000000",
      sku: { family: "A", name: "standard" },
      networkAcls: {
        defaultAction: "Deny",
        bypass: "AzureServices",
        ipRules: [{ value: "124.56.78.91" }, { value: "'10.91.4.0/24'" }],
        virtualNetworkRules: [
          {
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/subnet1",
          },
        ],
      },
      enabledForDeployment: true,
      enabledForDiskEncryption: true,
      enabledForTemplateDeployment: true,
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
The resource version is `2021-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/keyvault.json).
