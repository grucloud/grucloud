---
id: ManagedHsm
title: ManagedHsm
---
Provides a **ManagedHsm** from the **KeyVault** group
## Examples
### Create a new managed HSM Pool or update an existing managed HSM Pool
```js
provider.KeyVault.makeManagedHsm({
  name: "myManagedHsm",
  properties: () => ({
    properties: {
      tenantId: "00000000-0000-0000-0000-000000000000",
      initialAdminObjectIds: ["00000000-0000-0000-0000-000000000000"],
      enableSoftDelete: true,
      softDeleteRetentionInDays: 90,
      enablePurgeProtection: true,
    },
    location: "westus",
    sku: { family: "B", name: "Standard_B1" },
    tags: { Dept: "hsm", Environment: "dogfood" },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/managedHsm.json).
