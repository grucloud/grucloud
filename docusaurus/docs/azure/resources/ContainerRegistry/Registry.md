---
id: Registry
title: Registry
---
Provides a **Registry** from the **ContainerRegistry** group
## Examples
### RegistryCreate
```js
provider.ContainerRegistry.makeRegistry({
  name: "myRegistry",
  properties: () => ({
    location: "westus",
    tags: { key: "value" },
    sku: { name: "Standard" },
    properties: { adminUserEnabled: true },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
  }),
});

```

### RegistryCreateZoneRedundant
```js
provider.ContainerRegistry.makeRegistry({
  name: "myRegistry",
  properties: () => ({
    location: "westus",
    tags: { key: "value" },
    sku: { name: "Standard" },
    properties: { zoneRedundancy: "Enabled" },
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
  description: 'An object that represents a container registry.',
  required: [ 'sku' ],
  type: 'object',
  allOf: [
    {
      description: 'An Azure resource.',
      required: [ 'location' ],
      properties: {
        id: {
          description: 'The resource ID.',
          type: 'string',
          readOnly: true
        },
        name: {
          description: 'The name of the resource.',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'The type of the resource.',
          type: 'string',
          readOnly: true
        },
        location: {
          description: 'The location of the resource. This cannot be changed after the resource is created.',
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ]
        },
        tags: {
          description: 'The tags of the resource.',
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        systemData: {
          description: 'Metadata pertaining to creation and last modification of the resource.',
          type: 'object',
          readOnly: true,
          properties: {
            createdBy: {
              description: 'The identity that created the resource.',
              type: 'string'
            },
            createdByType: {
              description: 'The type of identity that created the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'createdByType', modelAsString: true }
            },
            createdAt: {
              format: 'date-time',
              description: 'The timestamp of resource creation (UTC).',
              type: 'string'
            },
            lastModifiedBy: {
              description: 'The identity that last modified the resource.',
              type: 'string'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }
            },
            lastModifiedAt: {
              format: 'date-time',
              description: 'The timestamp of resource modification (UTC).',
              type: 'string'
            }
          }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    sku: {
      description: 'The SKU of the container registry.',
      required: [ 'name' ],
      type: 'object',
      properties: {
        name: {
          description: 'The SKU name of the container registry. Required for registry creation.',
          enum: [ 'Classic', 'Basic', 'Standard', 'Premium' ],
          type: 'string',
          'x-ms-enum': { name: 'SkuName', modelAsString: true }
        },
        tier: {
          description: 'The SKU tier based on the SKU name.',
          enum: [ 'Classic', 'Basic', 'Standard', 'Premium' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'SkuTier', modelAsString: true }
        }
      }
    },
    identity: {
      description: 'The identity of the container registry.',
      type: 'object',
      properties: {
        principalId: {
          description: 'The principal ID of resource identity.',
          type: 'string'
        },
        tenantId: { description: 'The tenant ID of resource.', type: 'string' },
        type: {
          description: 'The identity type.',
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned, UserAssigned',
            'None'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          description: 'The list of user identities associated with the resource. The user identity \r\n' +
            'dictionary key references will be ARM resource ids in the form: \r\n' +
            "'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/\r\n" +
            "    providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.",
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              principalId: {
                description: 'The principal id of user assigned identity.',
                type: 'string'
              },
              clientId: {
                description: 'The client id of user assigned identity.',
                type: 'string'
              }
            }
          }
        }
      }
    },
    properties: {
      description: 'The properties of the container registry.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        loginServer: {
          description: 'The URL that can be used to log into the container registry.',
          type: 'string',
          readOnly: true
        },
        creationDate: {
          format: 'date-time',
          description: 'The creation date of the container registry in ISO8601 format.',
          type: 'string',
          readOnly: true
        },
        provisioningState: {
          description: 'The provisioning state of the container registry at the time the operation was called.',
          enum: [
            'Creating',
            'Updating',
            'Deleting',
            'Succeeded',
            'Failed',
            'Canceled'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        status: {
          description: 'The status of the container registry at the time the operation was called.',
          readOnly: true,
          type: 'object',
          properties: {
            displayStatus: {
              description: 'The short label for the status.',
              type: 'string',
              readOnly: true
            },
            message: {
              description: 'The detailed message for the status, including alerts and error messages.',
              type: 'string',
              readOnly: true
            },
            timestamp: {
              format: 'date-time',
              description: 'The timestamp when the status was changed to the current value.',
              type: 'string',
              readOnly: true
            }
          }
        },
        adminUserEnabled: {
          description: 'The value that indicates whether the admin user is enabled.',
          default: false,
          type: 'boolean'
        },
        networkRuleSet: {
          description: 'The network rule set for a container registry.',
          required: [ 'defaultAction' ],
          type: 'object',
          properties: {
            defaultAction: {
              description: 'The default action of allow or deny when no other rules match.',
              default: 'Allow',
              enum: [ 'Allow', 'Deny' ],
              type: 'string',
              'x-ms-enum': { name: 'DefaultAction', modelAsString: true }
            },
            ipRules: {
              description: 'The IP ACL rules.',
              type: 'array',
              items: {
                description: 'IP rule with specific IP or IP range in CIDR format.',
                required: [ 'value' ],
                type: 'object',
                properties: {
                  action: {
                    description: 'The action of IP ACL rule.',
                    default: 'Allow',
                    enum: [ 'Allow' ],
                    type: 'string',
                    'x-ms-enum': { name: 'Action', modelAsString: true }
                  },
                  value: {
                    description: 'Specifies the IP or IP range in CIDR format. Only IPV4 address is allowed.',
                    type: 'string',
                    'x-ms-client-name': 'IPAddressOrRange'
                  }
                }
              }
            }
          }
        },
        policies: {
          description: 'The policies for a container registry.',
          type: 'object',
          properties: {
            quarantinePolicy: {
              description: 'The quarantine policy for a container registry.',
              type: 'object',
              properties: {
                status: {
                  description: 'The value that indicates whether the policy is enabled or not.',
                  default: 'disabled',
                  enum: [ 'enabled', 'disabled' ],
                  type: 'string',
                  'x-ms-enum': { name: 'PolicyStatus', modelAsString: true }
                }
              }
            },
            trustPolicy: {
              description: 'The content trust policy for a container registry.',
              type: 'object',
              properties: {
                type: {
                  description: 'The type of trust policy.',
                  default: 'Notary',
                  enum: [ 'Notary' ],
                  type: 'string',
                  'x-ms-enum': { name: 'TrustPolicyType', modelAsString: true }
                },
                status: {
                  description: 'The value that indicates whether the policy is enabled or not.',
                  default: 'disabled',
                  enum: [ 'enabled', 'disabled' ],
                  type: 'string',
                  'x-ms-enum': { name: 'PolicyStatus', modelAsString: true }
                }
              }
            },
            retentionPolicy: {
              description: 'The retention policy for a container registry.',
              type: 'object',
              properties: {
                days: {
                  format: 'int32',
                  description: 'The number of days to retain an untagged manifest after which it gets purged.',
                  default: 7,
                  type: 'integer'
                },
                lastUpdatedTime: {
                  format: 'date-time',
                  description: 'The timestamp when the policy was last updated.',
                  type: 'string',
                  readOnly: true
                },
                status: {
                  description: 'The value that indicates whether the policy is enabled or not.',
                  default: 'disabled',
                  enum: [ 'enabled', 'disabled' ],
                  type: 'string',
                  'x-ms-enum': { name: 'PolicyStatus', modelAsString: true }
                }
              }
            },
            exportPolicy: {
              description: 'The export policy for a container registry.',
              type: 'object',
              properties: {
                status: {
                  description: 'The value that indicates whether the policy is enabled or not.',
                  default: 'enabled',
                  enum: [ 'enabled', 'disabled' ],
                  type: 'string',
                  'x-ms-enum': { name: 'ExportPolicyStatus', modelAsString: true }
                }
              }
            }
          }
        },
        encryption: {
          description: 'The encryption settings of container registry.',
          type: 'object',
          properties: {
            status: {
              description: 'Indicates whether or not the encryption is enabled for container registry.',
              enum: [ 'enabled', 'disabled' ],
              type: 'string',
              'x-ms-enum': { name: 'EncryptionStatus', modelAsString: true }
            },
            keyVaultProperties: {
              description: 'Key vault properties.',
              type: 'object',
              properties: {
                keyIdentifier: {
                  description: 'Key vault uri to access the encryption key.',
                  type: 'string'
                },
                versionedKeyIdentifier: {
                  description: 'The fully qualified key identifier that includes the version of the key that is actually used for encryption.',
                  type: 'string',
                  readOnly: true
                },
                identity: {
                  description: 'The client id of the identity which will be used to access key vault.',
                  type: 'string'
                },
                keyRotationEnabled: {
                  description: 'Auto key rotation status for a CMK enabled registry.',
                  type: 'boolean',
                  readOnly: true
                },
                lastKeyRotationTimestamp: {
                  format: 'date-time',
                  description: 'Timestamp of the last successful key rotation.',
                  type: 'string',
                  readOnly: true
                }
              }
            }
          }
        },
        dataEndpointEnabled: {
          description: 'Enable a single data endpoint per region for serving data.',
          type: 'boolean'
        },
        dataEndpointHostNames: {
          description: 'List of host names that will serve data when dataEndpointEnabled is true.',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        },
        privateEndpointConnections: {
          description: 'List of private endpoint connections for a container registry.',
          type: 'array',
          items: {
            description: 'An object that represents a private endpoint connection for a container registry.',
            type: 'object',
            allOf: [
              {
                description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',
                properties: {
                  id: {
                    description: 'The resource ID.',
                    type: 'string',
                    readOnly: true
                  },
                  name: {
                    description: 'The name of the resource.',
                    type: 'string',
                    readOnly: true
                  },
                  type: {
                    description: 'The type of the resource.',
                    type: 'string',
                    readOnly: true
                  },
                  systemData: {
                    description: 'Metadata pertaining to creation and last modification of the resource.',
                    type: 'object',
                    readOnly: true,
                    properties: {
                      createdBy: {
                        description: 'The identity that created the resource.',
                        type: 'string'
                      },
                      createdByType: {
                        description: 'The type of identity that created the resource.',
                        enum: [
                          'User',
                          'Application',
                          'ManagedIdentity',
                          'Key'
                        ],
                        type: 'string',
                        'x-ms-enum': { name: 'createdByType', modelAsString: true }
                      },
                      createdAt: {
                        format: 'date-time',
                        description: 'The timestamp of resource creation (UTC).',
                        type: 'string'
                      },
                      lastModifiedBy: {
                        description: 'The identity that last modified the resource.',
                        type: 'string'
                      },
                      lastModifiedByType: {
                        description: 'The type of identity that last modified the resource.',
                        enum: [
                          'User',
                          'Application',
                          'ManagedIdentity',
                          'Key'
                        ],
                        type: 'string',
                        'x-ms-enum': {
                          name: 'lastModifiedByType',
                          modelAsString: true
                        }
                      },
                      lastModifiedAt: {
                        format: 'date-time',
                        description: 'The timestamp of resource modification (UTC).',
                        type: 'string'
                      }
                    }
                  }
                },
                'x-ms-azure-resource': true
              }
            ],
            properties: {
              properties: {
                description: 'The properties of a private endpoint connection.',
                'x-ms-client-flatten': true,
                type: 'object',
                properties: {
                  privateEndpoint: {
                    description: 'The resource of private endpoint.',
                    type: 'object',
                    properties: {
                      id: {
                        description: 'This is private endpoint resource created with Microsoft.Network resource provider.',
                        type: 'string'
                      }
                    }
                  },
                  privateLinkServiceConnectionState: {
                    description: 'A collection of information about the state of the connection between service consumer and provider.',
                    type: 'object',
                    properties: {
                      status: {
                        description: 'The private link service connection status.',
                        enum: [
                          'Approved',
                          'Pending',
                          'Rejected',
                          'Disconnected'
                        ],
                        type: 'string',
                        'x-ms-enum': {
                          name: 'ConnectionStatus',
                          modelAsString: true
                        }
                      },
                      description: {
                        description: 'The description for connection status. For example if connection is rejected it can indicate reason for rejection.',
                        type: 'string'
                      },
                      actionsRequired: {
                        description: 'A message indicating if changes on the service provider require any updates on the consumer.',
                        enum: [ 'None', 'Recreate' ],
                        type: 'string',
                        'x-ms-enum': {
                          name: 'ActionsRequired',
                          modelAsString: true
                        }
                      }
                    }
                  },
                  provisioningState: {
                    description: 'The provisioning state of private endpoint connection resource.',
                    enum: [
                      'Creating',
                      'Updating',
                      'Deleting',
                      'Succeeded',
                      'Failed',
                      'Canceled'
                    ],
                    type: 'string',
                    readOnly: true,
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              }
            }
          },
          readOnly: true
        },
        publicNetworkAccess: {
          description: 'Whether or not public network access is allowed for the container registry.',
          default: 'Enabled',
          enum: [ 'Enabled', 'Disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'PublicNetworkAccess', modelAsString: true }
        },
        networkRuleBypassOptions: {
          description: 'Whether to allow trusted Azure services to access a network restricted registry.',
          default: 'AzureServices',
          enum: [ 'AzureServices', 'None' ],
          type: 'string',
          'x-ms-enum': { name: 'NetworkRuleBypassOptions', modelAsString: true }
        },
        zoneRedundancy: {
          description: 'Whether or not zone redundancy is enabled for this container registry',
          default: 'Disabled',
          enum: [ 'Enabled', 'Disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'ZoneRedundancy', modelAsString: true }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
