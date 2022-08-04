---
id: MHSMPrivateEndpointConnection
title: MHSMPrivateEndpointConnection
---
Provides a **MHSMPrivateEndpointConnection** from the **KeyVault** group
## Examples
### ManagedHsmPutPrivateEndpointConnection
```js
exports.createResources = () => [
  {
    type: "MHSMPrivateEndpointConnection",
    group: "KeyVault",
    name: "myMHSMPrivateEndpointConnection",
    properties: () => ({
      properties: {
        privateLinkServiceConnectionState: {
          status: "Approved",
          description: "My name is Joe and I'm approving this.",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      privateEndpoint: "myPrivateEndpoint",
      name: "myManagedHsm",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
- [ManagedHsm](../KeyVault/ManagedHsm.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Resource properties.',
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
              enum: [ 'Pending', 'Approved', 'Rejected', 'Disconnected' ],
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
              'x-ms-enum': { name: 'ActionsRequired', modelAsString: true }
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
    },
    etag: {
      type: 'string',
      description: 'Modified whenever there is a change in the state of private endpoint connection.'
    }
  },
  allOf: [
    {
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'The Azure Resource Manager resource ID for the managed HSM Pool.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the managed HSM Pool.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The resource type of the managed HSM Pool.'
        },
        location: {
          type: 'string',
          description: 'The supported Azure location where the managed HSM Pool should be created.',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        sku: {
          description: 'SKU details',
          properties: {
            family: {
              type: 'string',
              description: 'SKU Family of the managed HSM Pool',
              enum: [ 'B' ],
              'x-ms-client-default': 'B',
              'x-ms-enum': { name: 'ManagedHsmSkuFamily', modelAsString: true }
            },
            name: {
              type: 'string',
              description: 'SKU of the managed HSM Pool',
              enum: [ 'Standard_B1', 'Custom_B32' ],
              'x-ms-enum': { name: 'ManagedHsmSkuName', modelAsString: false }
            }
          },
          required: [ 'name', 'family' ],
          type: 'object'
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        },
        systemData: {
          description: 'Metadata pertaining to creation and last modification of the key vault resource.',
          readOnly: true,
          properties: {
            createdBy: {
              type: 'string',
              description: 'The identity that created the key vault resource.'
            },
            createdByType: {
              description: 'The type of identity that created the key vault resource.',
              type: 'string',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              'x-ms-enum': { name: 'identityType', modelAsString: true }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of the key vault resource creation (UTC).'
            },
            lastModifiedBy: {
              type: 'string',
              description: 'The identity that last modified the key vault resource.'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the key vault resource.',
              type: 'string',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              'x-ms-enum': { name: 'identityType', modelAsString: true }
            },
            lastModifiedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of the key vault resource last modification (UTC).'
            }
          },
          type: 'object'
        }
      },
      description: 'Managed HSM resource',
      'x-ms-azure-resource': true,
      type: 'object'
    }
  ],
  description: 'Private endpoint connection resource.',
  'x-ms-azure-resource': true,
  type: 'object'
}
```
## Misc
The resource version is `2022-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/stable/2022-07-01/managedHsm.json).
