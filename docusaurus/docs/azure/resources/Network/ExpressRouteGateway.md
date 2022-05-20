---
id: ExpressRouteGateway
title: ExpressRouteGateway
---
Provides a **ExpressRouteGateway** from the **Network** group
## Examples
### ExpressRouteGatewayCreate
```js
exports.createResources = () => [
  {
    type: "ExpressRouteGateway",
    group: "Network",
    name: "myExpressRouteGateway",
    properties: () => ({
      location: "westus",
      properties: {
        virtualHub: {
          id: "/subscriptions/subid/resourceGroups/resourceGroupId/providers/Microsoft.Network/virtualHubs/virtualHubName",
        },
        autoScaleConfiguration: { bounds: { min: 3 } },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      expressRouteCircuitPeering: "myExpressRouteCircuitPeering",
      routeTable: "myRouteTable",
      virtualHub: "myVirtualHub",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
- [RouteTable](../Network/RouteTable.md)
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route gateway.',
      required: [ 'virtualHub' ],
      properties: {
        autoScaleConfiguration: {
          properties: {
            bounds: {
              properties: {
                min: {
                  type: 'integer',
                  description: 'Minimum number of scale units deployed for ExpressRoute gateway.'
                },
                max: {
                  type: 'integer',
                  description: 'Maximum number of scale units deployed for ExpressRoute gateway.'
                }
              },
              description: 'Minimum and maximum number of scale units to deploy.'
            }
          },
          description: 'Configuration for auto scaling.'
        },
        expressRouteConnections: {
          type: 'array',
          description: 'List of ExpressRoute connections to the ExpressRoute gateway.',
          items: {
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
                  enableInternetSecurity: {
                    type: 'boolean',
                    description: 'Enable internet security.'
                  },
                  expressRouteGatewayBypass: {
                    type: 'boolean',
                    description: 'Enable FastPath to vWan Firewall hub.'
                  },
                  routingConfiguration: {
                    description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
                    properties: {
                      associatedRouteTable: {
                        description: 'The resource id RouteTable associated with this RoutingConfiguration.',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
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
                              properties: { id: [Object] },
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
                                name: [Object],
                                addressPrefixes: [Object],
                                nextHopIpAddress: [Object]
                              }
                            }
                          },
                          bgpConnections: {
                            type: 'array',
                            readOnly: true,
                            description: 'The list of references to HubBgpConnection objects.',
                            items: {
                              properties: { id: [Object] },
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
              name: {
                type: 'string',
                description: 'The name of the resource.'
              }
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
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the express route gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        virtualHub: {
          description: 'The Virtual Hub where the ExpressRoute gateway is or will be deployed.',
          properties: {
            id: {
              type: 'string',
              description: 'The resource URI for the Virtual Hub where the ExpressRoute gateway is or will be deployed. The Virtual Hub resource and the ExpressRoute gateway resource reside in the same subscription.'
            }
          }
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
  description: 'ExpressRoute gateway resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json).
