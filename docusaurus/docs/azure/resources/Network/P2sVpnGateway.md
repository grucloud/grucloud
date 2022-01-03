---
id: P2sVpnGateway
title: P2sVpnGateway
---
Provides a **P2sVpnGateway** from the **Network** group
## Examples
### P2SVpnGatewayPut
```js
provider.Network.makeP2sVpnGateway({
  name: "myP2sVpnGateway",
  properties: () => ({
    location: "West US",
    tags: { key1: "value1" },
    properties: {
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1",
      },
      vpnServerConfiguration: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1",
      },
      p2SConnectionConfigurations: [
        {
          name: "P2SConnectionConfig1",
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/p2sVpnGateways/p2sVpnGateway1/p2sConnectionConfigurations/P2SConnectionConfig1",
          properties: {
            vpnClientAddressPool: { addressPrefixes: ["101.3.0.0/16"] },
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
                  {
                    id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable2",
                  },
                  {
                    id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable3",
                  },
                ],
              },
              vnetRoutes: { staticRoutes: [] },
            },
          },
        },
      ],
      vpnGatewayScaleUnit: 1,
      customDnsServers: ["1.1.1.1", "2.2.2.2"],
      isRoutingPreferenceInternet: false,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
    vpnServerConfiguration:
      resources.Network.VpnServerConfiguration["myVpnServerConfiguration"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
- [RouteTable](../Network/RouteTable.md)
- [VpnServerConfiguration](../Network/VpnServerConfiguration.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the P2SVpnGateway.',
      properties: {
        virtualHub: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        p2SConnectionConfigurations: {
          type: 'array',
          description: 'List of all p2s connection configurations of the gateway.',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the P2S connection configuration.',
                properties: {
                  vpnClientAddressPool: {
                    description: 'The reference to the address space resource which represents Address space for P2S VpnClient.',
                    properties: { addressPrefixes: [Object] }
                  },
                  routingConfiguration: {
                    description: 'The Routing Configuration indicating the associated and propagated route tables on this connection.',
                    properties: {
                      associatedRouteTable: [Object],
                      propagatedRouteTables: [Object],
                      vnetRoutes: [Object]
                    }
                  },
                  enableInternetSecurity: {
                    type: 'boolean',
                    description: 'Flag indicating whether the enable internet security flag is turned on for the P2S Connections or not.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the P2SConnectionConfiguration resource.',
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
            description: 'P2SConnectionConfiguration Resource.'
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the P2S VPN gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        vpnGatewayScaleUnit: {
          type: 'integer',
          format: 'int32',
          description: 'The scale unit for this p2s vpn gateway.'
        },
        vpnServerConfiguration: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        vpnClientConnectionHealth: {
          readOnly: true,
          description: "All P2S VPN clients' connection health status.",
          properties: {
            totalIngressBytesTransferred: {
              readOnly: true,
              type: 'integer',
              format: 'int64',
              description: 'Total of the Ingress Bytes Transferred in this P2S Vpn connection.'
            },
            totalEgressBytesTransferred: {
              readOnly: true,
              type: 'integer',
              format: 'int64',
              description: 'Total of the Egress Bytes Transferred in this connection.'
            },
            vpnClientConnectionsCount: {
              type: 'integer',
              format: 'int32',
              description: 'The total of p2s vpn clients connected at this time to this P2SVpnGateway.'
            },
            allocatedIpAddresses: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of allocated ip addresses to the connected p2s vpn clients.'
            }
          }
        },
        customDnsServers: {
          type: 'array',
          description: 'List of all customer specified DNS servers IP addresses.',
          items: { type: 'string' }
        },
        isRoutingPreferenceInternet: {
          type: 'boolean',
          description: 'Enable Routing Preference property for the Public IP Interface of the P2SVpnGateway.'
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
  description: 'P2SVpnGateway Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
