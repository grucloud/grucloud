---
id: ExpressRouteCircuit
title: ExpressRouteCircuit
---
Provides a **ExpressRouteCircuit** from the **Network** group
## Examples
### Create ExpressRouteCircuit
```js
provider.Network.makeExpressRouteCircuit({
  name: "myExpressRouteCircuit",
  properties: () => ({
    sku: {
      name: "Standard_MeteredData",
      tier: "Standard",
      family: "MeteredData",
    },
    properties: {
      authorizations: [],
      peerings: [],
      allowClassicOperations: false,
      serviceProviderProperties: {
        serviceProviderName: "Equinix",
        peeringLocation: "Silicon Valley",
        bandwidthInMbps: 200,
      },
    },
    location: "Brazil South",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeFilter: resources.Network.RouteFilter["myRouteFilter"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
    route: resources.Network.Route["myRoute"],
  }),
});

```

### Create ExpressRouteCircuit on ExpressRoutePort
```js
provider.Network.makeExpressRouteCircuit({
  name: "myExpressRouteCircuit",
  properties: () => ({
    location: "westus",
    sku: {
      name: "Premium_MeteredData",
      tier: "Premium",
      family: "MeteredData",
    },
    properties: {
      expressRoutePort: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/expressRoutePorts/portName",
      },
      bandwidthInGbps: 10,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeFilter: resources.Network.RouteFilter["myRouteFilter"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
    route: resources.Network.Route["myRoute"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteFilter](../Network/RouteFilter.md)
- [ExpressRouteConnection](../Network/ExpressRouteConnection.md)
- [Route](../Network/Route.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'The SKU.',
      properties: {
        name: { type: 'string', description: 'The name of the SKU.' },
        tier: {
          type: 'string',
          description: 'The tier of the SKU.',
          enum: [ 'Standard', 'Premium', 'Basic', 'Local' ],
          'x-ms-enum': { name: 'ExpressRouteCircuitSkuTier', modelAsString: true }
        },
        family: {
          type: 'string',
          description: 'The family of the SKU.',
          enum: [ 'UnlimitedData', 'MeteredData' ],
          'x-ms-enum': { name: 'ExpressRouteCircuitSkuFamily', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the express route circuit.',
      properties: {
        allowClassicOperations: { type: 'boolean', description: 'Allow classic operations.' },
        circuitProvisioningState: {
          type: 'string',
          description: 'The CircuitProvisioningState state of the resource.'
        },
        serviceProviderProvisioningState: {
          description: 'The ServiceProviderProvisioningState state of the resource.',
          type: 'string',
          enum: [
            'NotProvisioned',
            'Provisioning',
            'Provisioned',
            'Deprovisioning'
          ],
          'x-ms-enum': {
            name: 'ServiceProviderProvisioningState',
            modelAsString: true
          }
        },
        authorizations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the express route circuit authorization.',
                properties: {
                  authorizationKey: {
                    type: 'string',
                    description: 'The authorization key.'
                  },
                  authorizationUseStatus: {
                    type: 'string',
                    description: 'The authorization use status.',
                    enum: [ 'Available', 'InUse' ],
                    'x-ms-enum': {
                      name: 'AuthorizationUseStatus',
                      modelAsString: true
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the authorization resource.',
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
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Authorization in an ExpressRouteCircuit resource.'
          },
          description: 'The list of authorizations.'
        },
        peerings: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the express route circuit peering.',
                properties: {
                  peeringType: {
                    description: 'The peering type.',
                    type: 'string',
                    enum: [
                      'AzurePublicPeering',
                      'AzurePrivatePeering',
                      'MicrosoftPeering'
                    ],
                    'x-ms-enum': {
                      name: 'ExpressRoutePeeringType',
                      modelAsString: true
                    }
                  },
                  state: {
                    description: 'The peering state.',
                    type: 'string',
                    enum: [ 'Disabled', 'Enabled' ],
                    'x-ms-enum': {
                      name: 'ExpressRoutePeeringState',
                      modelAsString: true
                    }
                  },
                  azureASN: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The Azure ASN.'
                  },
                  peerASN: {
                    type: 'integer',
                    format: 'int64',
                    minimum: 1,
                    maximum: 4294967295,
                    description: 'The peer ASN.'
                  },
                  primaryPeerAddressPrefix: {
                    type: 'string',
                    description: 'The primary address prefix.'
                  },
                  secondaryPeerAddressPrefix: {
                    type: 'string',
                    description: 'The secondary address prefix.'
                  },
                  primaryAzurePort: { type: 'string', description: 'The primary port.' },
                  secondaryAzurePort: {
                    type: 'string',
                    description: 'The secondary port.'
                  },
                  sharedKey: { type: 'string', description: 'The shared key.' },
                  vlanId: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The VLAN ID.'
                  },
                  microsoftPeeringConfig: {
                    description: 'The Microsoft peering configuration.',
                    properties: {
                      advertisedPublicPrefixes: [Object],
                      advertisedCommunities: [Object],
                      advertisedPublicPrefixesState: [Object],
                      legacyMode: [Object],
                      customerASN: [Object],
                      routingRegistryName: [Object]
                    }
                  },
                  stats: {
                    description: 'The peering stats of express route circuit.',
                    properties: {
                      primarybytesIn: [Object],
                      primarybytesOut: [Object],
                      secondarybytesIn: [Object],
                      secondarybytesOut: [Object]
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the express route circuit peering resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  gatewayManagerEtag: {
                    type: 'string',
                    description: 'The GatewayManager Etag.'
                  },
                  lastModifiedBy: {
                    readOnly: true,
                    type: 'string',
                    description: 'Who was the last to modify the peering.'
                  },
                  routeFilter: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  ipv6PeeringConfig: {
                    description: 'The IPv6 peering configuration.',
                    properties: {
                      primaryPeerAddressPrefix: [Object],
                      secondaryPeerAddressPrefix: [Object],
                      microsoftPeeringConfig: [Object],
                      routeFilter: [Object],
                      state: [Object]
                    }
                  },
                  expressRouteConnection: {
                    description: 'The ExpressRoute connection.',
                    properties: { id: [Object] }
                  },
                  connections: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Express Route Circuit Connection in an ExpressRouteCircuitPeering resource.'
                    },
                    description: 'The list of circuit connections associated with Azure Private Peering for this circuit.'
                  },
                  peeredConnections: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Peer Express Route Circuit Connection in an ExpressRouteCircuitPeering resource.'
                    },
                    readOnly: true,
                    description: 'The list of peered circuit connections associated with Azure Private Peering for this circuit.'
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
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Peering in an ExpressRouteCircuit resource.'
          },
          description: 'The list of peerings.'
        },
        serviceKey: { type: 'string', description: 'The ServiceKey.' },
        serviceProviderNotes: { type: 'string', description: 'The ServiceProviderNotes.' },
        serviceProviderProperties: {
          description: 'The ServiceProviderProperties.',
          properties: {
            serviceProviderName: { type: 'string', description: 'The serviceProviderName.' },
            peeringLocation: { type: 'string', description: 'The peering location.' },
            bandwidthInMbps: {
              type: 'integer',
              format: 'int32',
              description: 'The BandwidthInMbps.'
            }
          }
        },
        expressRoutePort: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        bandwidthInGbps: {
          type: 'number',
          description: 'The bandwidth of the circuit when the circuit is provisioned on an ExpressRoutePort resource.'
        },
        stag: {
          readOnly: true,
          type: 'integer',
          format: 'int32',
          description: 'The identifier of the circuit traffic. Outer tag for QinQ encapsulation.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the express route circuit resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        gatewayManagerEtag: { type: 'string', description: 'The GatewayManager Etag.' },
        globalReachEnabled: {
          type: 'boolean',
          description: 'Flag denoting global reach status.'
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
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
  description: 'ExpressRouteCircuit resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/expressRouteCircuit.json).
