---
id: VirtualHub
title: VirtualHub
---
Provides a **VirtualHub** from the **Network** group
## Examples
### VirtualHubPut
```js
exports.createResources = () => [
  {
    type: "VirtualHub",
    group: "Network",
    name: "myVirtualHub",
    properties: () => ({
      location: "West US",
      tags: { key1: "value1" },
      properties: {
        virtualWan: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualWans/virtualWan1",
        },
        addressPrefix: "10.168.0.0/24",
        sku: "Basic",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualWan: "myVirtualWan",
      vpnGateway: "myVpnGateway",
      p2sVpnGateway: "myP2sVpnGateway",
      expressRouteGateway: "myExpressRouteGateway",
      azureFirewall: "myAzureFirewall",
      securityPartnerProvider: "mySecurityPartnerProvider",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualWan](../Network/VirtualWan.md)
- [VpnGateway](../Network/VpnGateway.md)
- [P2sVpnGateway](../Network/P2sVpnGateway.md)
- [ExpressRouteGateway](../Network/ExpressRouteGateway.md)
- [AzureFirewall](../Network/AzureFirewall.md)
- [SecurityPartnerProvider](../Network/SecurityPartnerProvider.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the virtual hub.',
      properties: {
        virtualWan: {
          description: 'The VirtualWAN to which the VirtualHub belongs.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        vpnGateway: {
          description: 'The VpnGateway associated with this VirtualHub.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        p2SVpnGateway: {
          description: 'The P2SVpnGateway associated with this VirtualHub.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        expressRouteGateway: {
          description: 'The expressRouteGateway associated with this VirtualHub.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        azureFirewall: {
          description: 'The azureFirewall associated with this VirtualHub.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        securityPartnerProvider: {
          description: 'The securityPartnerProvider associated with this VirtualHub.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        addressPrefix: {
          type: 'string',
          description: 'Address-prefix for this VirtualHub.'
        },
        routeTable: {
          description: 'The routeTable associated with this virtual hub.',
          properties: {
            routes: {
              type: 'array',
              description: 'List of all routes.',
              items: {
                properties: {
                  addressPrefixes: {
                    type: 'array',
                    description: 'List of all addressPrefixes.',
                    items: { type: 'string' }
                  },
                  nextHopIpAddress: {
                    type: 'string',
                    description: 'NextHop ip address.'
                  }
                },
                description: 'VirtualHub route.'
              }
            }
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the virtual hub resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        securityProviderName: { type: 'string', description: 'The Security Provider name.' },
        virtualHubRouteTableV2s: {
          type: 'array',
          description: 'List of all virtual hub route table v2s associated with this VirtualHub.',
          items: {
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
                        nextHopType: {
                          type: 'string',
                          description: 'The type of next hops.'
                        },
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
        },
        sku: { type: 'string', description: 'The sku of this VirtualHub.' },
        routingState: {
          description: 'The routing state.',
          type: 'string',
          readOnly: true,
          enum: [ 'None', 'Provisioned', 'Provisioning', 'Failed' ],
          'x-ms-enum': { name: 'RoutingState', modelAsString: true }
        },
        bgpConnections: {
          type: 'array',
          readOnly: true,
          description: 'List of references to Bgp Connections.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        ipConfigurations: {
          type: 'array',
          readOnly: true,
          description: 'List of references to IpConfigurations.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        virtualRouterAsn: {
          type: 'integer',
          readOnly: false,
          format: 'int64',
          minimum: 0,
          maximum: 4294967295,
          description: 'VirtualRouter ASN.'
        },
        virtualRouterIps: {
          type: 'array',
          readOnly: false,
          description: 'VirtualRouter IPs.',
          items: { type: 'string' }
        },
        allowBranchToBranchTraffic: {
          type: 'boolean',
          readOnly: false,
          description: 'Flag to control transit for VirtualRouter hub.'
        },
        preferredRoutingGateway: {
          description: 'The preferred gateway to route on-prem traffic',
          type: 'string',
          enum: [ 'ExpressRoute', 'VpnGateway', 'None' ],
          'x-ms-enum': { name: 'PreferredRoutingGateway', modelAsString: true }
        },
        hubRoutingPreference: {
          description: 'The hubRoutingPreference of this VirtualHub.',
          type: 'string',
          enum: [ 'ExpressRoute', 'VpnGateway', 'ASPath' ],
          'x-ms-enum': { name: 'HubRoutingPreference', modelAsString: true }
        },
        virtualRouterAutoScaleConfiguration: {
          description: 'The VirtualHub Router autoscale configuration.',
          type: 'object',
          properties: {
            minCapacity: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              description: 'The minimum number of scale units for VirtualHub Router.'
            }
          }
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    kind: {
      readOnly: true,
      type: 'string',
      description: 'Kind of service virtual hub. This is metadata used for the Azure portal experience for Route Server.'
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
  description: 'VirtualHub Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
