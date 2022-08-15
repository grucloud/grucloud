---
id: NetworkWatcher
title: NetworkWatcher
---
Provides a **NetworkWatcher** from the **Network** group
## Examples
### Create network watcher
```js
exports.createResources = () => [
  {
    type: "NetworkWatcher",
    group: "Network",
    name: "myNetworkWatcher",
    properties: () => ({ location: "eastus", properties: {} }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```json
{
  properties: {
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the network watcher.',
      properties: {
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the network watcher resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
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
  description: 'Network watcher in a resource group.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/networkWatcher.json).
