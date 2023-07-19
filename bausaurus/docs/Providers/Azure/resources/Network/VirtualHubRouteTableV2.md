---
id: VirtualHubRouteTableV2
title: VirtualHubRouteTableV2
---
Provides a **VirtualHubRouteTableV2** from the **Network** group
## Examples
### VirtualHubRouteTableV2Put
```js
exports.createResources = () => [
  {
    type: "VirtualHubRouteTableV2",
    group: "Network",
    name: "myVirtualHubRouteTableV2",
    properties: () => ({
      properties: {
        routes: [
          {
            destinationType: "CIDR",
            destinations: ["20.10.0.0/16", "20.20.0.0/16"],
            nextHopType: "IPAddress",
            nextHops: ["10.0.0.68"],
          },
          {
            destinationType: "CIDR",
            destinations: ["0.0.0.0/0"],
            nextHopType: "IPAddress",
            nextHops: ["10.0.0.68"],
          },
        ],
        attachedConnections: ["All_Vnets"],
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
      description: 'Properties of the virtual hub route table v2.',
      properties: {
        routes: {
          type: 'array',
          description: 'List of all routes.',
          items: {
            properties: {
              destinationType: {
                type: 'string',
                description: 'The type of destinations.'
              },
              destinations: {
                type: 'array',
                description: 'List of all destinations.',
                items: { type: 'string' }
              },
              nextHopType: { type: 'string', description: 'The type of next hops.' },
              nextHops: {
                type: 'array',
                description: 'NextHops ip address.',
                items: { type: 'string' }
              }
            },
            description: 'VirtualHubRouteTableV2 route.'
          }
        },
        attachedConnections: {
          type: 'array',
          description: 'List of all connections attached to this route table v2.',
          items: { type: 'string' }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the virtual hub route table v2 resource.',
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
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'VirtualHubRouteTableV2 Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
