---
id: SecurityPartnerProvider
title: SecurityPartnerProvider
---
Provides a **SecurityPartnerProvider** from the **Network** group
## Examples
### Create Security Partner Provider
```js
provider.Network.makeSecurityPartnerProvider({
  name: "mySecurityPartnerProvider",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      securityProviderName: "ZScaler",
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the Security Partner Provider.',
      properties: {
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the Security Partner Provider resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        securityProviderName: {
          description: 'The security provider name.',
          type: 'string',
          enum: [ 'ZScaler', 'IBoss', 'Checkpoint' ],
          'x-ms-enum': { name: 'SecurityProviderName', modelAsString: true }
        },
        connectionStatus: {
          readOnly: true,
          description: 'The connection status with the Security Partner Provider.',
          type: 'string',
          enum: [
            'Unknown',
            'PartiallyConnected',
            'Connected',
            'NotConnected'
          ],
          'x-ms-enum': {
            name: 'SecurityPartnerProviderConnectionStatus',
            modelAsString: true
          }
        },
        virtualHub: {
          description: 'The virtualHub to which the Security Partner Provider belongs.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Security Partner Provider resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/securityPartnerProvider.json).
