---
id: VirtualHub
title: VirtualHub
---
Provides a **VirtualHub** from the **Network** group
## Examples
### VirtualHubPut
```js
provider.Network.makeVirtualHub({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualWan: resources.Network.VirtualWan["myVirtualWan"],
    vpnGateway: resources.Network.VpnGateway["myVpnGateway"],
    p2sVpnGateway: resources.Network.P2sVpnGateway["myP2sVpnGateway"],
    expressRouteGateway:
      resources.Network.ExpressRouteGateway["myExpressRouteGateway"],
    azureFirewall: resources.Network.AzureFirewall["myAzureFirewall"],
    securityPartnerProvider:
      resources.Network.SecurityPartnerProvider["mySecurityPartnerProvider"],
  }),
});

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
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        vpnGateway: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        p2SVpnGateway: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        expressRouteGateway: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        azureFirewall: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        securityPartnerProvider: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
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
                      properties: [Object],
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
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
