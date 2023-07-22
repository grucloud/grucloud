---
id: HubRouteTable
title: HubRouteTable
---
Provides a **HubRouteTable** from the **Network** group
## Examples
### RouteTablePut
```js
exports.createResources = () => [
  {
    type: "HubRouteTable",
    group: "Network",
    name: "myHubRouteTable",
    properties: () => ({
      properties: {
        routes: [
          {
            name: "route1",
            destinationType: "CIDR",
            destinations: ["10.0.0.0/8", "20.0.0.0/8", "30.0.0.0/8"],
            nextHopType: "ResourceId",
            nextHop:
              "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/azureFirewalls/azureFirewall1",
          },
        ],
        labels: ["label1", "label2"],
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
      description: 'Properties of the RouteTable resource.',
      properties: {
        routes: {
          type: 'array',
          description: 'List of all routes.',
          items: {
            required: [
              'name',
              'destinationType',
              'destinations',
              'nextHopType',
              'nextHop'
            ],
            properties: {
              name: {
                type: 'string',
                description: 'The name of the Route that is unique within a RouteTable. This name can be used to access this route.'
              },
              destinationType: {
                type: 'string',
                description: 'The type of destinations (eg: CIDR, ResourceId, Service).'
              },
              destinations: {
                type: 'array',
                description: 'List of all destinations.',
                items: { type: 'string' }
              },
              nextHopType: {
                type: 'string',
                description: 'The type of next hop (eg: ResourceId).'
              },
              nextHop: { type: 'string', description: 'NextHop resource ID.' }
            },
            description: 'RouteTable route.'
          }
        },
        labels: {
          type: 'array',
          description: 'List of labels associated with this route table.',
          items: { type: 'string' }
        },
        associatedConnections: {
          type: 'array',
          description: 'List of all connections associated with this route table.',
          readOnly: true,
          items: { type: 'string' }
        },
        propagatingConnections: {
          type: 'array',
          description: 'List of all connections that advertise to this route table.',
          readOnly: true,
          items: { type: 'string' }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the RouteTable resource.',
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
  description: 'RouteTable resource in a virtual hub.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
