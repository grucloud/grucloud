---
id: PrivateEndpointConnection
title: PrivateEndpointConnection
---
Provides a **PrivateEndpointConnection** from the **KeyVault** group
## Examples
### KeyVaultPutPrivateEndpointConnection
```js
provider.KeyVault.makePrivateEndpointConnection({
  name: "myPrivateEndpointConnection",
  properties: () => ({
    etag: "",
    properties: {
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "My name is Joe and I'm approving this.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    mhsmPrivateEndpointConnection:
      resources.KeyVault.MHSMPrivateEndpointConnection[
        "myMHSMPrivateEndpointConnection"
      ],
    vault: resources.KeyVault.Vault["myVault"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [MHSMPrivateEndpointConnection](../KeyVault/MHSMPrivateEndpointConnection.md)
- [Vault](../KeyVault/Vault.md)
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
          }
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
          }
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
      }
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
          description: 'Fully qualified identifier of the key vault resource.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Name of the key vault resource.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type of the key vault resource.'
        },
        location: {
          readOnly: true,
          type: 'string',
          description: 'Azure location of the key vault resource.'
        },
        tags: {
          readOnly: true,
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Tags assigned to the key vault resource.'
        }
      },
      description: 'Key Vault resource',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Private endpoint connection resource.',
  'x-ms-azure-resource': true
}
```
## Misc
The resource version is `2021-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/keyvault.json).
