---
id: ServiceEndpointPolicyDefinition
title: ServiceEndpointPolicyDefinition
---
Provides a **ServiceEndpointPolicyDefinition** from the **Network** group
## Examples
### Create service endpoint policy definition
```js
exports.createResources = () => [
  {
    type: "ServiceEndpointPolicyDefinition",
    group: "Network",
    name: "myServiceEndpointPolicyDefinition",
    properties: () => ({
      properties: {
        description: "Storage Service EndpointPolicy Definition",
        service: "Microsoft.Storage",
        serviceResources: [
          "/subscriptions/subid1",
          "/subscriptions/subid1/resourceGroups/storageRg",
          "/subscriptions/subid1/resourceGroups/storageRg/providers/Microsoft.Storage/storageAccounts/stAccount",
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      serviceEndpointPolicy: "myServiceEndpointPolicy",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ServiceEndpointPolicy](../Network/ServiceEndpointPolicy.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the service endpoint policy definition.',
      properties: {
        description: {
          type: 'string',
          description: 'A description for this rule. Restricted to 140 chars.'
        },
        service: { type: 'string', description: 'Service endpoint name.' },
        serviceResources: {
          type: 'array',
          items: { type: 'string' },
          description: 'A list of service resources.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the service endpoint policy definition resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { type: 'string', description: 'The type of the resource.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Service Endpoint policy definitions.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/serviceEndpointPolicy.json).
