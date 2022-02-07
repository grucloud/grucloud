---
id: HubVirtualNetworkConnection
title: HubVirtualNetworkConnection
---
Provides a **HubVirtualNetworkConnection** from the **Network** group
## Examples
### HubVirtualNetworkConnectionPut
```js
provider.Network.makeHubVirtualNetworkConnection({
  name: "myHubVirtualNetworkConnection",
  properties: () => ({
    properties: {
      remoteVirtualNetwork: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/SpokeVnet1",
      },
      enableInternetSecurity: false,
      routingConfiguration: {
        associatedRouteTable: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
        },
        propagatedRouteTables: {
          labels: ["label1", "label2"],
          ids: [
            {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
            },
          ],
        },
        vnetRoutes: {
          staticRoutes: [
            {
              name: "route1",
              addressPrefixes: ["10.1.0.0/16", "10.2.0.0/16"],
              nextHopIpAddress: "10.0.0.68",
            },
            {
              name: "route2",
              addressPrefixes: ["10.3.0.0/16", "10.4.0.0/16"],
              nextHopIpAddress: "10.0.0.65",
            },
          ],
        },
      },
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    virtualNetwork: "myVirtualNetwork",
    routeTable: "myRouteTable",
    virtualHub: "myVirtualHub",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [RouteTable](../Network/RouteTable.md)
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the hub virtual network connection.',
      properties: {
        remoteVirtualNetwork: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        allowHubToRemoteVnetTransit: {
          type: 'boolean',
          description: 'Deprecated: VirtualHub to RemoteVnet transit to enabled or not.'
        },
        allowRemoteVnetToUseHubVnetGateways: {
          type: 'boolean',
          description: "Deprecated: Allow RemoteVnet to use Virtual Hub's gateways."
        },
        enableInternetSecurity: { type: 'boolean', description: 'Enable internet security.' },
        routingConfiguration: {
          description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
          properties: {
            associatedRouteTable: {
              properties: { id: { type: 'string', description: 'Resource ID.' } },
              description: 'Reference to another subresource.',
              'x-ms-azure-resource': true
            },
            propagatedRouteTables: {
              description: 'The list of RouteTables to advertise the routes to.',
              properties: {
                labels: {
                  type: 'array',
                  description: 'The list of labels.',
                  items: { type: 'string' }
                },
                ids: {
                  type: 'array',
                  description: 'The list of resource ids of all the RouteTables.',
                  items: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  }
                }
              }
            },
            vnetRoutes: {
              description: 'List of routes that control routing from VirtualHub into a virtual network connection.',
              properties: {
                staticRoutes: {
                  type: 'array',
                  description: 'List of all Static Routes.',
                  items: {
                    description: 'List of all Static Routes.',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'The name of the StaticRoute that is unique within a VnetRoute.'
                      },
                      addressPrefixes: {
                        type: 'array',
                        description: 'List of all address prefixes.',
                        items: { type: 'string' }
                      },
                      nextHopIpAddress: {
                        type: 'string',
                        description: 'The ip address of the next hop.'
                      }
                    }
                  }
                },
                bgpConnections: {
                  type: 'array',
                  readOnly: true,
                  description: 'The list of references to HubBgpConnection objects.',
                  items: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  }
                }
              }
            }
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the hub virtual network connection resource.',
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
  description: 'HubVirtualNetworkConnection Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
