---
id: StorageAccount
title: StorageAccount
---
Provides a **StorageAccount** from the **Storage** group
## Examples
### StorageAccountCreate
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Standard_GRS" },
    kind: "Storage",
    location: "eastus",
    extendedLocation: { type: "EdgeZone", name: "losangeles001" },
    properties: {
      keyPolicy: { keyExpirationPeriodInDays: 20 },
      sasPolicy: { sasExpirationPeriod: "1.15:59:59", expirationAction: "Log" },
      isHnsEnabled: true,
      allowBlobPublicAccess: false,
      defaultToOAuthAuthentication: false,
      minimumTlsVersion: "TLS1_2",
      allowSharedKeyAccess: true,
      routingPreference: {
        routingChoice: "MicrosoftRouting",
        publishMicrosoftEndpoints: true,
        publishInternetEndpoints: true,
      },
      encryption: {
        services: {
          file: { keyType: "Account", enabled: true },
          blob: { keyType: "Account", enabled: true },
        },
        requireInfrastructureEncryption: false,
        keySource: "Microsoft.Storage",
      },
    },
    tags: { key1: "value1", key2: "value2" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### NfsV3AccountCreate
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Premium_LRS" },
    kind: "BlockBlobStorage",
    location: "eastus",
    properties: {
      isHnsEnabled: true,
      isNfsV3Enabled: true,
      supportsHttpsTrafficOnly: false,
      networkAcls: {
        bypass: "AzureServices",
        defaultAction: "Allow",
        ipRules: [],
        virtualNetworkRules: [
          {
            id: "/subscriptions/{subscription-id}/resourceGroups/res9101/providers/Microsoft.Network/virtualNetworks/net123/subnets/subnet12",
          },
        ],
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### StorageAccountCreateUserAssignedEncryptionIdentityWithCMK
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/{subscription-id}/resourceGroups/res9101/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{managed-identity-name}":
          {},
      },
    },
    sku: { name: "Standard_LRS" },
    kind: "Storage",
    location: "eastus",
    properties: {
      encryption: {
        services: {
          file: { keyType: "Account", enabled: true },
          blob: { keyType: "Account", enabled: true },
        },
        keyvaultproperties: {
          keyvaulturi: "https://myvault8569.vault.azure.net",
          keyname: "wrappingKey",
          keyversion: "",
        },
        keySource: "Microsoft.Keyvault",
        identity: {
          userAssignedIdentity:
            "/subscriptions/{subscription-id}/resourceGroups/res9101/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{managed-identity-name}",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### StorageAccountCreateWithImmutabilityPolicy
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Standard_GRS" },
    kind: "Storage",
    location: "eastus",
    extendedLocation: { type: "EdgeZone", name: "losangeles001" },
    properties: {
      immutableStorageWithVersioning: {
        immutabilityPolicy: {
          immutabilityPeriodSinceCreationInDays: 15,
          allowProtectedAppendWrites: true,
          state: "Unlocked",
        },
        enabled: true,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### StorageAccountCreateDisallowPublicNetworkAccess.
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Standard_GRS" },
    kind: "Storage",
    location: "eastus",
    extendedLocation: { type: "EdgeZone", name: "losangeles001" },
    properties: {
      keyPolicy: { keyExpirationPeriodInDays: 20 },
      sasPolicy: { sasExpirationPeriod: "1.15:59:59", expirationAction: "Log" },
      isHnsEnabled: true,
      allowBlobPublicAccess: false,
      minimumTlsVersion: "TLS1_2",
      allowSharedKeyAccess: true,
      publicNetworkAccess: "Disabled",
      routingPreference: {
        routingChoice: "MicrosoftRouting",
        publishMicrosoftEndpoints: true,
        publishInternetEndpoints: true,
      },
      encryption: {
        services: {
          file: { keyType: "Account", enabled: true },
          blob: { keyType: "Account", enabled: true },
        },
        requireInfrastructureEncryption: false,
        keySource: "Microsoft.Storage",
      },
    },
    tags: { key1: "value1", key2: "value2" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### StorageAccountCreateEnablePublicNetworkAccess.
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Standard_GRS" },
    kind: "Storage",
    location: "eastus",
    extendedLocation: { type: "EdgeZone", name: "losangeles001" },
    properties: {
      keyPolicy: { keyExpirationPeriodInDays: 20 },
      sasPolicy: { sasExpirationPeriod: "1.15:59:59", expirationAction: "Log" },
      isHnsEnabled: true,
      allowBlobPublicAccess: false,
      minimumTlsVersion: "TLS1_2",
      allowSharedKeyAccess: true,
      publicNetworkAccess: "Enabled",
      routingPreference: {
        routingChoice: "MicrosoftRouting",
        publishMicrosoftEndpoints: true,
        publishInternetEndpoints: true,
      },
      encryption: {
        services: {
          file: { keyType: "Account", enabled: true },
          blob: { keyType: "Account", enabled: true },
        },
        requireInfrastructureEncryption: false,
        keySource: "Microsoft.Storage",
      },
    },
    tags: { key1: "value1", key2: "value2" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/storage.json).
