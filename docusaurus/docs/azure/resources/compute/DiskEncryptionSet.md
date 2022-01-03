---
id: DiskEncryptionSet
title: DiskEncryptionSet
---
Provides a **DiskEncryptionSet** from the **Compute** group
## Examples
### Create a disk encryption set.
```js
provider.Compute.makeDiskEncryptionSet({
  name: "myDiskEncryptionSet",
  properties: () => ({
    location: "West US",
    identity: { type: "SystemAssigned" },
    properties: {
      activeKey: {
        sourceVault: {
          id: "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myVMVault",
        },
        keyUrl: "https://myvmvault.vault-int.azure-int.net/keys/{key}",
      },
      encryptionType: "EncryptionAtRestWithCustomerKey",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vault: resources.KeyVault.Vault["myVault"],
    key: resources.KeyVault.Key["myKey"],
  }),
});

```

### Create a disk encryption set with key vault from a different subscription.
```js
provider.Compute.makeDiskEncryptionSet({
  name: "myDiskEncryptionSet",
  properties: () => ({
    location: "West US",
    identity: { type: "SystemAssigned" },
    properties: {
      activeKey: {
        keyUrl:
          "https://myvaultdifferentsub.vault-int.azure-int.net/keys/{key}",
      },
      encryptionType: "EncryptionAtRestWithCustomerKey",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vault: resources.KeyVault.Vault["myVault"],
    key: resources.KeyVault.Key["myKey"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Vault](../KeyVault/Vault.md)
- [Key](../KeyVault/Key.md)
## Misc
The resource version is `2021-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-04-01/disk.json).
