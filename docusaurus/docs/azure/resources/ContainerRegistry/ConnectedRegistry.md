---
id: ConnectedRegistry
title: ConnectedRegistry
---
Provides a **ConnectedRegistry** from the **ContainerRegistry** group
## Examples
### ConnectedRegistryCreate
```js
provider.ContainerRegistry.makeConnectedRegistry({
  name: "myConnectedRegistry",
  properties: () => ({
    properties: {
      mode: "ReadWrite",
      parent: {
        syncProperties: {
          tokenId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/tokens/syncToken",
          schedule: "0 9 * * *",
          messageTtl: "P2D",
          syncWindow: "PT3H",
        },
      },
      clientTokenIds: [
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/tokens/client1Token",
      ],
      notificationsList: ["hello-world:*:*", "sample/repo/*:1.0:*"],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'An object that represents a connected registry for a container registry.',
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
    properties: {
      description: 'The properties of the connected registry.',
      'x-ms-client-flatten': true,
      required: [ 'mode', 'parent' ],
      type: 'object',
      properties: {
        provisioningState: {
          description: 'Provisioning state of the resource.',
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
        mode: {
          description: 'The mode of the connected registry resource that indicates the permissions of the registry.',
          enum: [ 'ReadWrite', 'ReadOnly', 'Registry', 'Mirror' ],
          type: 'string',
          'x-ms-enum': { name: 'ConnectedRegistryMode', modelAsString: true }
        },
        version: {
          description: 'The current version of ACR runtime on the connected registry.',
          type: 'string',
          readOnly: true
        },
        connectionState: {
          description: 'The current connection state of the connected registry.',
          enum: [ 'Online', 'Offline', 'Syncing', 'Unhealthy' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ConnectionState', modelAsString: true }
        },
        lastActivityTime: {
          format: 'date-time',
          description: 'The last activity time of the connected registry.',
          type: 'string',
          readOnly: true
        },
        activation: {
          description: 'The activation properties of the connected registry.',
          readOnly: true,
          type: 'object',
          properties: {
            status: {
              description: 'The activation status of the connected registry.',
              enum: [ 'Active', 'Inactive' ],
              type: 'string',
              readOnly: true,
              'x-ms-enum': { name: 'ActivationStatus', modelAsString: true }
            }
          }
        },
        parent: {
          description: 'The parent of the connected registry.',
          required: [ 'syncProperties' ],
          type: 'object',
          properties: {
            id: {
              description: 'The resource ID of the parent to which the connected registry will be associated.',
              type: 'string'
            },
            syncProperties: {
              description: 'The sync properties of the connected registry with its parent.',
              required: [ 'tokenId', 'messageTtl' ],
              type: 'object',
              properties: {
                tokenId: {
                  description: 'The resource ID of the ACR token used to authenticate the connected registry to its parent during sync.',
                  type: 'string'
                },
                schedule: {
                  description: 'The cron expression indicating the schedule that the connected registry will sync with its parent.',
                  type: 'string'
                },
                syncWindow: {
                  format: 'duration',
                  description: 'The time window during which sync is enabled for each schedule occurrence. Specify the duration using the format P[n]Y[n]M[n]DT[n]H[n]M[n]S as per ISO8601.',
                  type: 'string'
                },
                messageTtl: {
                  format: 'duration',
                  description: 'The period of time for which a message is available to sync before it is expired. Specify the duration using the format P[n]Y[n]M[n]DT[n]H[n]M[n]S as per ISO8601.',
                  type: 'string'
                },
                lastSyncTime: {
                  format: 'date-time',
                  description: 'The last time a sync occurred between the connected registry and its parent.',
                  type: 'string',
                  readOnly: true
                },
                gatewayEndpoint: {
                  description: 'The gateway endpoint used by the connected registry to communicate with its parent.',
                  type: 'string',
                  readOnly: true
                }
              }
            }
          }
        },
        clientTokenIds: {
          description: 'The list of the ACR token resource IDs used to authenticate clients to the connected registry.',
          type: 'array',
          items: { type: 'string' }
        },
        loginServer: {
          description: 'The login server properties of the connected registry.',
          type: 'object',
          properties: {
            host: {
              description: 'The host of the connected registry. Can be FQDN or IP.',
              type: 'string',
              readOnly: true
            },
            tls: {
              description: 'The TLS properties of the connected registry login server.',
              readOnly: true,
              type: 'object',
              properties: {
                status: {
                  description: 'Indicates whether HTTPS is enabled for the login server.',
                  enum: [ 'Enabled', 'Disabled' ],
                  type: 'string',
                  readOnly: true,
                  'x-ms-enum': { name: 'TlsStatus', modelAsString: true }
                },
                certificate: {
                  description: 'The certificate used to configure HTTPS for the login server.',
                  readOnly: true,
                  type: 'object',
                  properties: {
                    type: {
                      description: 'The type of certificate location.',
                      enum: [Array],
                      type: 'string',
                      readOnly: true,
                      'x-ms-enum': [Object]
                    },
                    location: {
                      description: 'Indicates the location of the certificates.',
                      type: 'string',
                      readOnly: true
                    }
                  }
                }
              }
            }
          }
        },
        logging: {
          description: 'The logging properties of the connected registry.',
          type: 'object',
          properties: {
            logLevel: {
              description: 'The verbosity of logs persisted on the connected registry.',
              default: 'Information',
              enum: [ 'Debug', 'Information', 'Warning', 'Error', 'None' ],
              type: 'string',
              'x-ms-enum': { name: 'LogLevel', modelAsString: true }
            },
            auditLogStatus: {
              description: 'Indicates whether audit logs are enabled on the connected registry.',
              default: 'Disabled',
              enum: [ 'Enabled', 'Disabled' ],
              type: 'string',
              'x-ms-enum': { name: 'AuditLogStatus', modelAsString: true }
            }
          }
        },
        statusDetails: {
          description: 'The list of current statuses of the connected registry.',
          type: 'array',
          items: {
            description: 'The status detail properties of the connected registry.',
            type: 'object',
            properties: {
              type: {
                description: 'The component of the connected registry corresponding to the status.',
                type: 'string',
                readOnly: true
              },
              code: {
                description: 'The code of the status.',
                type: 'string',
                readOnly: true
              },
              description: {
                description: 'The description of the status.',
                type: 'string',
                readOnly: true
              },
              timestamp: {
                format: 'date-time',
                description: 'The timestamp of the status.',
                type: 'string',
                readOnly: true
              },
              correlationId: {
                description: 'The correlation ID of the status.',
                type: 'string',
                readOnly: true
              }
            }
          },
          readOnly: true
        },
        notificationsList: {
          description: 'The list of notifications subscription information for the connected registry.',
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-08-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-08-01-preview/containerregistry.json).
