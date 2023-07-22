---
id: RoutingIntent
title: RoutingIntent
---
Provides a **RoutingIntent** from the **Network** group
## Examples
### RouteTablePut
```js
exports.createResources = () => [
  {
    type: "RoutingIntent",
    group: "Network",
    name: "myRoutingIntent",
    properties: () => ({
      properties: {
        routingPolicies: [
          {
            name: "InternetTraffic",
            destinations: ["Internet"],
            nextHop:
              "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/azureFirewalls/azfw1",
          },
          {
            name: "PrivateTrafficPolicy",
            destinations: ["PrivateTraffic"],
            nextHop:
              "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/azureFirewalls/azfw1",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualHub: "myVirtualHub",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the RoutingIntent resource.',
      properties: {
        routingPolicies: {
          type: 'array',
          description: 'List of routing policies.',
          readOnly: false,
          items: {
            required: [ 'name', 'destinations', 'nextHop' ],
            properties: {
              name: {
                type: 'string',
                description: 'The unique name for the routing policy.'
              },
              destinations: {
                type: 'array',
                description: 'List of all destinations which this routing policy is applicable to (for example: Internet, PrivateTraffic).',
                items: { type: 'string' }
              },
              nextHop: {
                type: 'string',
                description: 'The next hop resource id on which this routing policy is applicable to.'
              }
            },
            description: 'The routing policy object used in a RoutingIntent resource.',
            type: 'object'
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the RoutingIntent resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      },
      type: 'object'
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { readOnly: true, type: 'string', description: 'Resource type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'The routing intent child resource of a Virtual hub.',
  type: 'object'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
