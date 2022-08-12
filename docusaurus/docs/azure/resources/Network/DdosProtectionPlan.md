---
id: DdosProtectionPlan
title: DdosProtectionPlan
---
Provides a **DdosProtectionPlan** from the **Network** group
## Examples
### Create DDoS protection plan
```js
exports.createResources = () => [
  {
    type: "DdosProtectionPlan",
    group: "Network",
    name: "myDdosProtectionPlan",
    properties: () => ({ location: "westus", properties: {} }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```json
{
  description: 'A DDoS protection plan in a resource group.',
  'x-ms-azure-resource': true,
  properties: {
    id: { readOnly: true, type: 'string', description: 'Resource ID.' },
    name: { readOnly: true, type: 'string', description: 'Resource name.' },
    type: { readOnly: true, type: 'string', description: 'Resource type.' },
    location: { type: 'string', description: 'Resource location.' },
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      description: 'Resource tags.'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the DDoS protection plan.',
      properties: {
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the DDoS protection plan resource. It uniquely identifies the resource, even if the user changes its name or migrate the resource across subscriptions or resource groups.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the DDoS protection plan resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        virtualNetworks: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'The list of virtual networks associated with the DDoS protection plan resource. This list is read-only.'
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  }
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/ddosProtectionPlan.json).
