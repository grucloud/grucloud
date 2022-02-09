---
id: ExpressRouteConnection
title: ExpressRouteConnection
---
Provides a **ExpressRouteConnection** from the **Network** group
## Examples
### ExpressRouteConnectionCreate
```js
exports.createResources = () => [
  {
    type: "ExpressRouteConnection",
    group: "Network",
    name: "myExpressRouteConnection",
    properties: () => ({
      id: "/subscriptions/subid/resourceGroups/resourceGroupName/providers/Microsoft.Network/expressRouteGateways/gateway-2/expressRouteConnections/connectionName",
      name: "connectionName",
      properties: {
        routingWeight: 2,
        authorizationKey: "authorizationKey",
        expressRouteCircuitPeering: {
          id: "/subscriptions/subid/resourceGroups/resourceGroupName/providers/Microsoft.Network/expressRouteCircuits/circuitName/peerings/AzurePrivatePeering",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      expressRouteCircuitPeering: "myExpressRouteCircuitPeering",
      routeTable: "myRouteTable",
      expressRouteGateway: "myExpressRouteGateway",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
- [RouteTable](../Network/RouteTable.md)
- [ExpressRouteGateway](../Network/ExpressRouteGateway.md)
## Swagger Schema
```js
{
  required: [ 'name' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route connection.',
      required: [ 'expressRouteCircuitPeering' ],
      properties: {
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the express route connection resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        expressRouteCircuitPeering: {
          description: 'The ExpressRoute circuit peering.',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the ExpressRoute circuit peering.'
            }
          }
        },
        authorizationKey: {
          type: 'string',
          description: 'Authorization key to establish the connection.'
        },
        routingWeight: {
          type: 'integer',
          description: 'The routing weight associated to the connection.'
        },
        enableInternetSecurity: { type: 'boolean', description: 'Enable internet security.' },
        expressRouteGatewayBypass: {
          type: 'boolean',
          description: 'Enable FastPath to vWan Firewall hub.'
        },
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
        }
      }
    },
    name: { type: 'string', description: 'The name of the resource.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'ExpressRouteConnection resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
