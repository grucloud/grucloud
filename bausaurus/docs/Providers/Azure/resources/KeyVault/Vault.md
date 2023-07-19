---
id: Vault
title: Vault
---
Provides a **Vault** from the **KeyVault** group
## Examples
### Create a new vault or update an existing vault
```js
exports.createResources = () => [
  {
    type: "Vault",
    group: "KeyVault",
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
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
    }),
  },
];

```

### Create or update a vault with network acls
```js
exports.createResources = () => [
  {
    type: "Vault",
    group: "KeyVault",
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
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
## Swagger Schema
```json
{
  properties: {
    location: {
      type: 'string',
      description: 'The supported Azure location where the key vault should be created.'
    },
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      description: 'The tags that will be assigned to the key vault.'
    },
    properties: {
      description: 'Properties of the vault',
      properties: {
        tenantId: {
          type: 'string',
          format: 'uuid',
          description: 'The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.'
        },
        sku: {
          description: 'SKU details',
          properties: {
            family: {
              type: 'string',
              description: 'SKU family name',
              enum: [ 'A' ],
              'x-ms-client-default': 'A',
              'x-ms-enum': { name: 'SkuFamily', modelAsString: true }
            },
            name: {
              type: 'string',
              description: 'SKU name to specify whether the key vault is a standard vault or a premium vault.',
              enum: [ 'standard', 'premium' ],
              'x-ms-enum': { name: 'SkuName', modelAsString: false }
            }
          },
          required: [ 'name', 'family' ],
          type: 'object'
        },
        accessPolicies: {
          type: 'array',
          items: {
            properties: {
              tenantId: {
                type: 'string',
                format: 'uuid',
                description: 'The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.'
              },
              objectId: {
                type: 'string',
                description: 'The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies.'
              },
              applicationId: {
                type: 'string',
                format: 'uuid',
                description: ' Application ID of the client making request on behalf of a principal'
              },
              permissions: {
                description: 'Permissions the identity has for keys, secrets and certificates.',
                properties: {
                  keys: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'all',
                        'encrypt',
                        'decrypt',
                        'wrapKey',
                        'unwrapKey',
                        'sign',
                        'verify',
                        'get',
                        'list',
                        'create',
                        'update',
                        'import',
                        'delete',
                        'backup',
                        'restore',
                        'recover',
                        'purge',
                        'release',
                        'rotate',
                        'getrotationpolicy',
                        'setrotationpolicy'
                      ],
                      'x-ms-enum': { name: 'KeyPermissions', modelAsString: true }
                    },
                    description: 'Permissions to keys'
                  },
                  secrets: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'all',     'get',
                        'list',    'set',
                        'delete',  'backup',
                        'restore', 'recover',
                        'purge'
                      ],
                      'x-ms-enum': {
                        name: 'SecretPermissions',
                        modelAsString: true
                      }
                    },
                    description: 'Permissions to secrets'
                  },
                  certificates: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'all',           'get',
                        'list',          'delete',
                        'create',        'import',
                        'update',        'managecontacts',
                        'getissuers',    'listissuers',
                        'setissuers',    'deleteissuers',
                        'manageissuers', 'recover',
                        'purge',         'backup',
                        'restore'
                      ],
                      'x-ms-enum': {
                        name: 'CertificatePermissions',
                        modelAsString: true
                      }
                    },
                    description: 'Permissions to certificates'
                  },
                  storage: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'all',           'get',
                        'list',          'delete',
                        'set',           'update',
                        'regeneratekey', 'recover',
                        'purge',         'backup',
                        'restore',       'setsas',
                        'listsas',       'getsas',
                        'deletesas'
                      ],
                      'x-ms-enum': {
                        name: 'StoragePermissions',
                        modelAsString: true
                      }
                    },
                    description: 'Permissions to storage accounts'
                  }
                },
                type: 'object'
              }
            },
            description: "An identity that have access to the key vault. All identities in the array must use the same tenant ID as the key vault's tenant ID.",
            required: [ 'tenantId', 'objectId', 'permissions' ],
            type: 'object'
          },
          description: "An array of 0 to 1024 identities that have access to the key vault. All identities in the array must use the same tenant ID as the key vault's tenant ID. When `createMode` is set to `recover`, access policies are not required. Otherwise, access policies are required."
        },
        vaultUri: {
          type: 'string',
          description: 'The URI of the vault for performing operations on keys and secrets.'
        },
        hsmPoolResourceId: {
          type: 'string',
          description: 'The resource id of HSM Pool.',
          readOnly: true
        },
        enabledForDeployment: {
          type: 'boolean',
          description: 'Property to specify whether Azure Virtual Machines are permitted to retrieve certificates stored as secrets from the key vault.'
        },
        enabledForDiskEncryption: {
          type: 'boolean',
          description: 'Property to specify whether Azure Disk Encryption is permitted to retrieve secrets from the vault and unwrap keys.'
        },
        enabledForTemplateDeployment: {
          type: 'boolean',
          description: 'Property to specify whether Azure Resource Manager is permitted to retrieve secrets from the key vault.'
        },
        enableSoftDelete: {
          type: 'boolean',
          default: true,
          description: "Property to specify whether the 'soft delete' functionality is enabled for this key vault. If it's not set to any value(true or false) when creating new key vault, it will be set to true by default. Once set to true, it cannot be reverted to false."
        },
        softDeleteRetentionInDays: {
          type: 'integer',
          format: 'int32',
          default: 90,
          description: 'softDelete data retention days. It accepts >=7 and <=90.'
        },
        enableRbacAuthorization: {
          type: 'boolean',
          default: false,
          description: 'Property that controls how data actions are authorized. When true, the key vault will use Role Based Access Control (RBAC) for authorization of data actions, and the access policies specified in vault properties will be  ignored. When false, the key vault will use the access policies specified in vault properties, and any policy stored on Azure Resource Manager will be ignored. If null or not specified, the vault is created with the default value of false. Note that management actions are always authorized with RBAC.'
        },
        createMode: {
          type: 'string',
          description: "The vault's create mode to indicate whether the vault need to be recovered or not.",
          enum: [ 'recover', 'default' ],
          'x-ms-enum': { name: 'CreateMode', modelAsString: false },
          'x-ms-mutability': [ 'create', 'update' ]
        },
        enablePurgeProtection: {
          type: 'boolean',
          description: 'Property specifying whether protection against purge is enabled for this vault. Setting this property to true activates protection against purge for this vault and its content - only the Key Vault service may initiate a hard, irrecoverable deletion. The setting is effective only if soft delete is also enabled. Enabling this functionality is irreversible - that is, the property does not accept false as its value.'
        },
        networkAcls: {
          description: 'Rules governing the accessibility of the key vault from specific network locations.',
          properties: {
            bypass: {
              type: 'string',
              description: "Tells what traffic can bypass network rules. This can be 'AzureServices' or 'None'.  If not specified the default is 'AzureServices'.",
              enum: [ 'AzureServices', 'None' ],
              'x-ms-enum': { name: 'NetworkRuleBypassOptions', modelAsString: true }
            },
            defaultAction: {
              type: 'string',
              description: 'The default action when no rule from ipRules and from virtualNetworkRules match. This is only used after the bypass property has been evaluated.',
              enum: [ 'Allow', 'Deny' ],
              'x-ms-enum': { name: 'NetworkRuleAction', modelAsString: true }
            },
            ipRules: {
              type: 'array',
              items: {
                properties: {
                  value: {
                    type: 'string',
                    description: "An IPv4 address range in CIDR notation, such as '124.56.78.91' (simple IP address) or '124.56.78.0/24' (all addresses that start with 124.56.78)."
                  }
                },
                required: [ 'value' ],
                description: 'A rule governing the accessibility of a vault from a specific ip address or ip range.',
                type: 'object'
              },
              description: 'The list of IP address rules.'
            },
            virtualNetworkRules: {
              type: 'array',
              items: {
                properties: {
                  id: {
                    type: 'string',
                    description: "Full resource id of a vnet subnet, such as '/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/subnet1'."
                  },
                  ignoreMissingVnetServiceEndpoint: {
                    type: 'boolean',
                    description: 'Property to specify whether NRP will ignore the check if parent subnet has serviceEndpoints configured.'
                  }
                },
                required: [ 'id' ],
                description: 'A rule governing the accessibility of a vault from a specific virtual network.',
                type: 'object'
              },
              description: 'The list of virtual network rules.'
            }
          },
          type: 'object'
        },
        provisioningState: {
          type: 'string',
          description: 'Provisioning state of the vault.',
          enum: [ 'Succeeded', 'RegisteringDns' ],
          'x-ms-enum': { name: 'VaultProvisioningState', modelAsString: true }
        },
        privateEndpointConnections: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'string',
                description: 'Id of private endpoint connection.'
              },
              etag: {
                type: 'string',
                description: 'Modified whenever there is a change in the state of private endpoint connection.'
              },
              properties: {
                'x-ms-client-flatten': true,
                description: 'Private endpoint connection properties.',
                properties: {
                  privateEndpoint: {
                    description: 'Properties of the private endpoint object.',
                    properties: {
                      id: {
                        readOnly: true,
                        type: 'string',
                        description: 'Full identifier of the private endpoint resource.'
                      }
                    },
                    type: 'object'
                  },
                  privateLinkServiceConnectionState: {
                    description: 'Approval state of the private link connection.',
                    properties: {
                      status: {
                        description: 'Indicates whether the connection has been approved, rejected or removed by the key vault owner.',
                        type: 'string',
                        enum: [
                          'Pending',
                          'Approved',
                          'Rejected',
                          'Disconnected'
                        ],
                        'x-ms-enum': {
                          name: 'PrivateEndpointServiceConnectionStatus',
                          modelAsString: true
                        }
                      },
                      description: {
                        type: 'string',
                        description: 'The reason for approval or rejection.'
                      },
                      actionsRequired: {
                        type: 'string',
                        description: 'A message indicating if changes on the service provider require any updates on the consumer.',
                        enum: [ 'None' ],
                        'x-ms-enum': {
                          name: 'ActionsRequired',
                          modelAsString: true
                        }
                      }
                    },
                    type: 'object'
                  },
                  provisioningState: {
                    description: 'Provisioning state of the private endpoint connection.',
                    type: 'string',
                    readOnly: true,
                    enum: [
                      'Succeeded',
                      'Creating',
                      'Updating',
                      'Deleting',
                      'Failed',
                      'Disconnected'
                    ],
                    'x-ms-enum': {
                      name: 'PrivateEndpointConnectionProvisioningState',
                      modelAsString: true
                    }
                  }
                },
                type: 'object'
              }
            },
            description: 'Private endpoint connection item.',
            type: 'object'
          },
          description: 'List of private endpoint connections associated with the key vault.'
        },
        publicNetworkAccess: {
          type: 'string',
          default: 'enabled',
          description: "Property to specify whether the vault will accept traffic from public internet. If set to 'disabled' all traffic except private endpoint traffic and that that originates from trusted services will be blocked. This will override the set firewall rules, meaning that even if the firewall rules are present we will not honor the rules."
        }
      },
      required: [ 'tenantId', 'sku' ],
      type: 'object'
    }
  },
  description: 'Parameters for creating or updating a vault',
  required: [ 'location', 'properties' ],
  'x-ms-azure-resource': true,
  type: 'object'
}
```
## Misc
The resource version is `2022-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/stable/2022-07-01/keyvault.json).
