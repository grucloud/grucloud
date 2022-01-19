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
      isSftpEnabled: true,
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```

### StorageAccountCreateDisallowPublicNetworkAccess
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```

### StorageAccountCreateEnablePublicNetworkAccess
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```

### StorageAccountCreateUserAssignedIdentityWithFederatedIdentityClientId.
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
          federatedIdentityClientId: "f83c6b1b-4d34-47e4-bb34-9d83df58b540",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```

### StorageAccountCreateAllowedCopyScopeToPrivateLink
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Standard_GRS" },
    kind: "Storage",
    location: "eastus",
    properties: {
      keyPolicy: { keyExpirationPeriodInDays: 20 },
      sasPolicy: { sasExpirationPeriod: "1.15:59:59", expirationAction: "Log" },
      isHnsEnabled: true,
      allowBlobPublicAccess: false,
      minimumTlsVersion: "TLS1_2",
      allowSharedKeyAccess: true,
      allowedCopyScope: "PrivateLink",
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```

### StorageAccountCreateAllowedCopyScopeToAAD
```js
provider.Storage.makeStorageAccount({
  name: "myStorageAccount",
  properties: () => ({
    sku: { name: "Standard_GRS" },
    kind: "Storage",
    location: "eastus",
    properties: {
      keyPolicy: { keyExpirationPeriodInDays: 20 },
      sasPolicy: { sasExpirationPeriod: "1.15:59:59", expirationAction: "Log" },
      isHnsEnabled: true,
      allowBlobPublicAccess: false,
      minimumTlsVersion: "TLS1_2",
      allowSharedKeyAccess: true,
      allowedCopyScope: "AAD",
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'Required. Gets or sets the SKU name.',
      properties: {
        name: {
          type: 'string',
          description: 'The SKU name. Required for account creation; optional for update. Note that in older versions, SKU name was called accountType.',
          enum: [
            'Standard_LRS',
            'Standard_GRS',
            'Standard_RAGRS',
            'Standard_ZRS',
            'Premium_LRS',
            'Premium_ZRS',
            'Standard_GZRS',
            'Standard_RAGZRS'
          ],
          'x-ms-enum': { name: 'SkuName', modelAsString: true }
        },
        tier: {
          readOnly: true,
          type: 'string',
          description: 'The SKU tier. This is based on the SKU name.',
          enum: [ 'Standard', 'Premium' ],
          'x-ms-enum': { name: 'SkuTier', modelAsString: false }
        }
      },
      required: [ 'name' ]
    },
    kind: {
      type: 'string',
      description: 'Required. Indicates the type of storage account.',
      enum: [
        'Storage',
        'StorageV2',
        'BlobStorage',
        'FileStorage',
        'BlockBlobStorage'
      ],
      'x-ms-enum': { name: 'Kind', modelAsString: true }
    },
    location: {
      type: 'string',
      description: 'Required. Gets or sets the location of the resource. This will be one of the supported and registered Azure Geo Regions (e.g. West US, East US, Southeast Asia, etc.). The geo region of a resource cannot be changed once it is created, but if an identical geo region is specified on update, the request will succeed.'
    },
    extendedLocation: {
      description: 'Optional. Set the extended location of the resource. If not set, the storage account will be created in Azure main region. Otherwise it will be created in the specified extended location',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    },
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      description: 'Gets or sets a list of key value pairs that describe the resource. These tags can be used for viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key with a length no greater than 128 characters and a value with a length no greater than 256 characters.'
    },
    identity: {
      description: 'The identity of the resource.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal ID of resource identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant ID of resource.'
        },
        type: {
          type: 'string',
          description: 'The identity type.',
          enum: [
            'None',
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned,UserAssigned'
          ],
          'x-ms-enum': { name: 'IdentityType', modelAsString: true }
        },
        userAssignedIdentities: {
          type: 'object',
          additionalProperties: {
            properties: {
              principalId: {
                readOnly: true,
                type: 'string',
                description: 'The principal ID of the identity.'
              },
              clientId: {
                readOnly: true,
                type: 'string',
                description: 'The client ID of the identity.'
              }
            },
            description: 'UserAssignedIdentity for the resource.'
          },
          description: 'Gets or sets a list of key value pairs that describe the set of User Assigned identities that will be used with this storage account. The key is the ARM resource identifier of the identity. Only 1 User Assigned identity is permitted here.'
        }
      },
      required: [ 'type' ]
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'The parameters used to create the storage account.',
      properties: {
        allowedCopyScope: {
          type: 'string',
          description: 'Restrict copy to and from Storage Accounts within an AAD tenant or with Private Links to the same VNet.',
          enum: [ 'PrivateLink', 'AAD' ],
          'x-ms-enum': { name: 'AllowedCopyScope', modelAsString: true }
        },
        publicNetworkAccess: {
          type: 'string',
          description: "Allow or disallow public network access to Storage Account. Value is optional but if passed in, must be 'Enabled' or 'Disabled'.",
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': { name: 'PublicNetworkAccess', modelAsString: true }
        },
        sasPolicy: {
          description: 'SasPolicy assigned to the storage account.',
          properties: {
            sasExpirationPeriod: {
              type: 'string',
              example: '1.15:59:59',
              description: 'The SAS expiration period, DD.HH:MM:SS.'
            },
            expirationAction: {
              type: 'string',
              enum: [ 'Log' ],
              'x-ms-enum': { name: 'ExpirationAction', modelAsString: true },
              default: 'Log',
              description: 'The SAS expiration action. Can only be Log.'
            }
          },
          required: [ 'sasExpirationPeriod', 'expirationAction' ]
        },
        keyPolicy: {
          description: 'KeyPolicy assigned to the storage account.',
          properties: {
            keyExpirationPeriodInDays: {
              type: 'integer',
              description: 'The key expiration period in days.',
              format: 'int32'
            }
          },
          required: [ 'keyExpirationPeriodInDays' ]
        },
        customDomain: {
          description: 'User domain assigned to the storage account. Name is the CNAME source. Only one custom domain is supported per storage account at this time. To clear the existing custom domain, use an empty string for the custom domain name property.',
          properties: {
            name: {
              type: 'string',
              description: 'Gets or sets the custom domain name assigned to the storage account. Name is the CNAME source.'
            },
            useSubDomainName: {
              type: 'boolean',
              description: 'Indicates whether indirect CName validation is enabled. Default value is false. This should only be set on updates.'
            }
          },
          required: [ 'name' ]
        },
        encryption: {
          description: 'Encryption settings to be used for server-side encryption for the storage account.',
          properties: {
            services: {
              description: 'List of services which support encryption.',
              properties: {
                blob: {
                  description: 'The encryption function of the blob storage service.',
                  properties: {
                    enabled: {
                      type: 'boolean',
                      description: 'A boolean indicating whether or not the service encrypts the data as it is stored. Encryption at rest is enabled by default today and cannot be disabled.'
                    },
                    lastEnabledTime: {
                      readOnly: true,
                      type: 'string',
                      format: 'date-time',
                      description: 'Gets a rough estimate of the date/time when the encryption was last enabled by the user. Data is encrypted at rest by default today and cannot be disabled.'
                    },
                    keyType: {
                      type: 'string',
                      description: "Encryption key type to be used for the encryption service. 'Account' key type implies that an account-scoped encryption key will be used. 'Service' key type implies that a default service key is used.",
                      enum: [ 'Service', 'Account' ],
                      'x-ms-enum': { name: 'KeyType', modelAsString: true },
                      'x-ms-mutability': [ 'create', 'read' ]
                    }
                  }
                },
                file: {
                  description: 'The encryption function of the file storage service.',
                  properties: {
                    enabled: {
                      type: 'boolean',
                      description: 'A boolean indicating whether or not the service encrypts the data as it is stored. Encryption at rest is enabled by default today and cannot be disabled.'
                    },
                    lastEnabledTime: {
                      readOnly: true,
                      type: 'string',
                      format: 'date-time',
                      description: 'Gets a rough estimate of the date/time when the encryption was last enabled by the user. Data is encrypted at rest by default today and cannot be disabled.'
                    },
                    keyType: {
                      type: 'string',
                      description: "Encryption key type to be used for the encryption service. 'Account' key type implies that an account-scoped encryption key will be used. 'Service' key type implies that a default service key is used.",
                      enum: [ 'Service', 'Account' ],
                      'x-ms-enum': { name: 'KeyType', modelAsString: true },
                      'x-ms-mutability': [ 'create', 'read' ]
                    }
                  }
                },
                table: {
                  description: 'The encryption function of the table storage service.',
                  properties: {
                    enabled: {
                      type: 'boolean',
                      description: 'A boolean indicating whether or not the service encrypts the data as it is stored. Encryption at rest is enabled by default today and cannot be disabled.'
                    },
                    lastEnabledTime: {
                      readOnly: true,
                      type: 'string',
                      format: 'date-time',
                      description: 'Gets a rough estimate of the date/time when the encryption was last enabled by the user. Data is encrypted at rest by default today and cannot be disabled.'
                    },
                    keyType: {
                      type: 'string',
                      description: "Encryption key type to be used for the encryption service. 'Account' key type implies that an account-scoped encryption key will be used. 'Service' key type implies that a default service key is used.",
                      enum: [ 'Service', 'Account' ],
                      'x-ms-enum': { name: 'KeyType', modelAsString: true },
                      'x-ms-mutability': [ 'create', 'read' ]
                    }
                  }
                },
                queue: {
                  description: 'The encryption function of the queue storage service.',
                  properties: {
                    enabled: {
                      type: 'boolean',
                      description: 'A boolean indicating whether or not the service encrypts the data as it is stored. Encryption at rest is enabled by default today and cannot be disabled.'
                    },
                    lastEnabledTime: {
                      readOnly: true,
                      type: 'string',
                      format: 'date-time',
                      description: 'Gets a rough estimate of the date/time when the encryption was last enabled by the user. Data is encrypted at rest by default today and cannot be disabled.'
                    },
                    keyType: {
                      type: 'string',
                      description: "Encryption key type to be used for the encryption service. 'Account' key type implies that an account-scoped encryption key will be used. 'Service' key type implies that a default service key is used.",
                      enum: [ 'Service', 'Account' ],
                      'x-ms-enum': { name: 'KeyType', modelAsString: true },
                      'x-ms-mutability': [ 'create', 'read' ]
                    }
                  }
                }
              }
            },
            keySource: {
              type: 'string',
              description: 'The encryption keySource (provider). Possible values (case-insensitive):  Microsoft.Storage, Microsoft.Keyvault',
              enum: [ 'Microsoft.Storage', 'Microsoft.Keyvault' ],
              'x-ms-enum': { name: 'KeySource', modelAsString: true },
              default: 'Microsoft.Storage'
            },
            requireInfrastructureEncryption: {
              type: 'boolean',
              'x-ms-client-name': 'RequireInfrastructureEncryption',
              description: 'A boolean indicating whether or not the service applies a secondary layer of encryption with platform managed keys for data at rest.'
            },
            keyvaultproperties: {
              'x-ms-client-name': 'KeyVaultProperties',
              description: 'Properties provided by key vault.',
              properties: {
                keyname: {
                  type: 'string',
                  description: 'The name of KeyVault key.',
                  'x-ms-client-name': 'KeyName'
                },
                keyversion: {
                  type: 'string',
                  description: 'The version of KeyVault key.',
                  'x-ms-client-name': 'KeyVersion'
                },
                keyvaulturi: {
                  type: 'string',
                  description: 'The Uri of KeyVault.',
                  'x-ms-client-name': 'KeyVaultUri'
                },
                currentVersionedKeyIdentifier: {
                  type: 'string',
                  readOnly: true,
                  description: 'The object identifier of the current versioned Key Vault Key in use.',
                  'x-ms-client-name': 'CurrentVersionedKeyIdentifier'
                },
                lastKeyRotationTimestamp: {
                  type: 'string',
                  readOnly: true,
                  format: 'date-time',
                  description: 'Timestamp of last rotation of the Key Vault Key.',
                  'x-ms-client-name': 'LastKeyRotationTimestamp'
                }
              }
            },
            identity: {
              'x-ms-client-name': 'EncryptionIdentity',
              description: 'The identity to be used with service-side encryption at rest.',
              properties: {
                userAssignedIdentity: {
                  type: 'string',
                  description: 'Resource identifier of the UserAssigned identity to be associated with server-side encryption on the storage account.',
                  'x-ms-client-name': 'EncryptionUserAssignedIdentity'
                },
                federatedIdentityClientId: {
                  type: 'string',
                  description: 'ClientId of the multi-tenant application to be used in conjunction with the user-assigned identity for cross-tenant customer-managed-keys server-side encryption on the storage account.',
                  'x-ms-client-name': 'EncryptionFederatedIdentityClientId'
                }
              }
            }
          },
          required: [ 'keySource' ]
        },
        networkAcls: {
          'x-ms-client-name': 'NetworkRuleSet',
          description: 'Network rule set',
          properties: {
            bypass: {
              type: 'string',
              enum: [ 'None', 'Logging', 'Metrics', 'AzureServices' ],
              'x-ms-enum': { name: 'Bypass', modelAsString: true },
              'x-ms-client-name': 'Bypass',
              default: 'AzureServices',
              description: 'Specifies whether traffic is bypassed for Logging/Metrics/AzureServices. Possible values are any combination of Logging|Metrics|AzureServices (For example, "Logging, Metrics"), or None to bypass none of those traffics.'
            },
            resourceAccessRules: {
              type: 'array',
              items: {
                description: 'Resource Access Rules.',
                properties: {
                  tenantId: { type: 'string', description: 'Tenant Id' },
                  resourceId: { type: 'string', description: 'Resource Id' }
                }
              },
              description: 'Sets the resource access rules'
            },
            virtualNetworkRules: {
              type: 'array',
              items: {
                description: 'Virtual Network rule.',
                properties: {
                  id: {
                    type: 'string',
                    'x-ms-client-name': 'VirtualNetworkResourceId',
                    description: 'Resource ID of a subnet, for example: /subscriptions/{subscriptionId}/resourceGroups/{groupName}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{subnetName}.'
                  },
                  action: {
                    type: 'string',
                    enum: [ 'Allow' ],
                    'x-ms-enum': { name: 'Action', modelAsString: false },
                    default: 'Allow',
                    description: 'The action of virtual network rule.'
                  },
                  state: {
                    type: 'string',
                    enum: [
                      'Provisioning',
                      'Deprovisioning',
                      'Succeeded',
                      'Failed',
                      'NetworkSourceDeleted'
                    ],
                    'x-ms-enum': { name: 'State', modelAsString: true },
                    description: 'Gets the state of virtual network rule.'
                  }
                },
                required: [ 'id' ]
              },
              description: 'Sets the virtual network rules'
            },
            ipRules: {
              type: 'array',
              items: {
                description: 'IP rule with specific IP or IP range in CIDR format.',
                properties: {
                  value: {
                    type: 'string',
                    'x-ms-client-name': 'IPAddressOrRange',
                    description: 'Specifies the IP or IP range in CIDR format. Only IPV4 address is allowed.'
                  },
                  action: {
                    type: 'string',
                    enum: [ 'Allow' ],
                    'x-ms-enum': { name: 'Action', modelAsString: false },
                    default: 'Allow',
                    description: 'The action of IP ACL rule.'
                  }
                },
                required: [ 'value' ]
              },
              description: 'Sets the IP ACL rules'
            },
            defaultAction: {
              type: 'string',
              enum: [ 'Allow', 'Deny' ],
              'x-ms-enum': { name: 'DefaultAction', modelAsString: false },
              default: 'Allow',
              description: 'Specifies the default action of allow or deny when no other rules match.'
            }
          },
          required: [ 'defaultAction' ]
        },
        accessTier: {
          type: 'string',
          description: 'Required for storage accounts where kind = BlobStorage. The access tier used for billing.',
          enum: [ 'Hot', 'Cool' ],
          'x-ms-enum': { name: 'AccessTier', modelAsString: false }
        },
        azureFilesIdentityBasedAuthentication: {
          description: 'Provides the identity based authentication settings for Azure Files.',
          properties: {
            directoryServiceOptions: {
              type: 'string',
              description: 'Indicates the directory service used.',
              enum: [ 'None', 'AADDS', 'AD' ],
              'x-ms-enum': { name: 'DirectoryServiceOptions', modelAsString: true }
            },
            activeDirectoryProperties: {
              description: 'Required if choose AD.',
              properties: {
                domainName: {
                  type: 'string',
                  description: 'Specifies the primary domain that the AD DNS server is authoritative for.'
                },
                netBiosDomainName: {
                  type: 'string',
                  description: 'Specifies the NetBIOS domain name.'
                },
                forestName: {
                  type: 'string',
                  description: 'Specifies the Active Directory forest to get.'
                },
                domainGuid: {
                  type: 'string',
                  description: 'Specifies the domain GUID.'
                },
                domainSid: {
                  type: 'string',
                  description: 'Specifies the security identifier (SID).'
                },
                azureStorageSid: {
                  type: 'string',
                  description: 'Specifies the security identifier (SID) for Azure Storage.'
                },
                samAccountName: {
                  type: 'string',
                  description: 'Specifies the Active Directory SAMAccountName for Azure Storage.'
                },
                accountType: {
                  type: 'string',
                  description: 'Specifies the Active Directory account type for Azure Storage.',
                  enum: [ 'User', 'Computer' ]
                }
              },
              required: [
                'domainName',
                'netBiosDomainName',
                'forestName',
                'domainGuid',
                'domainSid',
                'azureStorageSid'
              ]
            },
            defaultSharePermission: {
              type: 'string',
              description: 'Default share permission for users using Kerberos authentication if RBAC role is not assigned.',
              enum: [
                'None',
                'StorageFileDataSmbShareReader',
                'StorageFileDataSmbShareContributor',
                'StorageFileDataSmbShareElevatedContributor'
              ],
              'x-ms-enum': { name: 'DefaultSharePermission', modelAsString: true }
            }
          },
          required: [ 'directoryServiceOptions' ]
        },
        supportsHttpsTrafficOnly: {
          type: 'boolean',
          'x-ms-client-name': 'EnableHttpsTrafficOnly',
          description: 'Allows https traffic only to storage service if sets to true. The default value is true since API version 2019-04-01.'
        },
        isSftpEnabled: {
          type: 'boolean',
          'x-ms-client-name': 'IsSftpEnabled',
          description: 'Enables Secure File Transfer Protocol, if set to true'
        },
        isLocalUserEnabled: {
          type: 'boolean',
          'x-ms-client-name': 'IsLocalUserEnabled',
          description: 'Enables local users feature, if set to true'
        },
        isHnsEnabled: {
          type: 'boolean',
          'x-ms-client-name': 'IsHnsEnabled',
          description: 'Account HierarchicalNamespace enabled if sets to true.'
        },
        largeFileSharesState: {
          type: 'string',
          enum: [ 'Disabled', 'Enabled' ],
          'x-ms-enum': { name: 'LargeFileSharesState', modelAsString: true },
          description: 'Allow large file shares if sets to Enabled. It cannot be disabled once it is enabled.'
        },
        routingPreference: {
          'x-ms-client-name': 'RoutingPreference',
          description: 'Maintains information about the network routing choice opted by the user for data transfer',
          properties: {
            routingChoice: {
              type: 'string',
              description: 'Routing Choice defines the kind of network routing opted by the user.',
              enum: [ 'MicrosoftRouting', 'InternetRouting' ],
              'x-ms-enum': { name: 'RoutingChoice', modelAsString: true }
            },
            publishMicrosoftEndpoints: {
              type: 'boolean',
              description: 'A boolean flag which indicates whether microsoft routing storage endpoints are to be published'
            },
            publishInternetEndpoints: {
              type: 'boolean',
              description: 'A boolean flag which indicates whether internet routing storage endpoints are to be published'
            }
          }
        },
        allowBlobPublicAccess: {
          type: 'boolean',
          'x-ms-client-name': 'AllowBlobPublicAccess',
          description: 'Allow or disallow public access to all blobs or containers in the storage account. The default interpretation is true for this property.'
        },
        minimumTlsVersion: {
          type: 'string',
          enum: [ 'TLS1_0', 'TLS1_1', 'TLS1_2' ],
          'x-ms-enum': { name: 'MinimumTlsVersion', modelAsString: true },
          description: 'Set the minimum TLS version to be permitted on requests to storage. The default interpretation is TLS 1.0 for this property.'
        },
        allowSharedKeyAccess: {
          type: 'boolean',
          description: 'Indicates whether the storage account permits requests to be authorized with the account access key via Shared Key. If false, then all requests, including shared access signatures, must be authorized with Azure Active Directory (Azure AD). The default value is null, which is equivalent to true.'
        },
        isNfsV3Enabled: {
          type: 'boolean',
          'x-ms-client-name': 'EnableNfsV3',
          description: 'NFS 3.0 protocol support enabled if set to true.'
        },
        allowCrossTenantReplication: {
          type: 'boolean',
          description: 'Allow or disallow cross AAD tenant object replication. The default interpretation is true for this property.'
        },
        defaultToOAuthAuthentication: {
          type: 'boolean',
          description: 'A boolean flag which indicates whether the default authentication is OAuth or not. The default interpretation is false for this property.'
        },
        immutableStorageWithVersioning: {
          'x-ms-client-name': 'ImmutableStorageWithVersioning',
          description: 'The property is immutable and can only be set to true at the account creation time. When set to true, it enables object level immutability for all the new containers in the account by default.',
          type: 'object',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'A boolean flag which enables account-level immutability. All the containers under such an account have object-level immutability enabled by default.'
            },
            immutabilityPolicy: {
              'x-ms-client-flatten': false,
              description: 'Specifies the default account-level immutability policy which is inherited and applied to objects that do not possess an explicit immutability policy at the object level. The object-level immutability policy has higher precedence than the container-level immutability policy, which has a higher precedence than the account-level immutability policy.',
              type: 'object',
              properties: {
                immutabilityPeriodSinceCreationInDays: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 146000,
                  format: 'int32',
                  description: 'The immutability period for the blobs in the container since the policy creation, in days.'
                },
                state: {
                  type: 'string',
                  description: 'The ImmutabilityPolicy state defines the mode of the policy. Disabled state disables the policy, Unlocked state allows increase and decrease of immutability retention time and also allows toggling allowProtectedAppendWrites property, Locked state only allows the increase of the immutability retention time. A policy can only be created in a Disabled or Unlocked state and can be toggled between the two states. Only a policy in an Unlocked state can transition to a Locked state which cannot be reverted.',
                  enum: [ 'Unlocked', 'Locked', 'Disabled' ],
                  'x-ms-enum': {
                    name: 'AccountImmutabilityPolicyState',
                    modelAsString: true
                  }
                },
                allowProtectedAppendWrites: {
                  type: 'boolean',
                  description: 'This property can only be changed for disabled and unlocked time-based retention policies. When enabled, new blocks can be written to an append blob while maintaining immutability protection and compliance. Only new blocks can be added and any existing blocks cannot be modified or deleted.'
                }
              }
            }
          }
        }
      }
    }
  },
  required: [ 'sku', 'kind', 'location' ],
  description: 'The parameters used when creating a storage account.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-08-01/storage.json).
