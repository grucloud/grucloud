---
id: RouteFilter
title: RouteFilter
---
Provides a **RouteFilter** from the **Network** group
## Examples
### RouteFilterCreate
```js
provider.Network.makeRouteFilter({
  name: "myRouteFilter",
  properties: () => ({
    location: "West US",
    tags: { key1: "value1" },
    properties: {
      rules: [
        {
          name: "ruleName",
          properties: {
            access: "Allow",
            routeFilterRuleType: "Community",
            communities: ["12076:5030", "12076:5040"],
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    route: resources.Network.Route["myRoute"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Route](../Network/Route.md)
- [ExpressRouteConnection](../Network/ExpressRouteConnection.md)
## Swagger Schema
```js
{
  required: [ 'location' ],
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the route filter.',
      properties: {
        rules: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the route filter rule.',
                required: [ 'access', 'routeFilterRuleType', 'communities' ],
                properties: {
                  access: {
                    description: 'The access type of the rule.',
                    type: 'string',
                    enum: [ 'Allow', 'Deny' ],
                    'x-ms-enum': { name: 'Access', modelAsString: true }
                  },
                  routeFilterRuleType: {
                    type: 'string',
                    description: 'The rule type of the rule.',
                    enum: [ 'Community' ],
                    'x-ms-enum': {
                      name: 'RouteFilterRuleType',
                      modelAsString: true
                    }
                  },
                  communities: {
                    type: 'array',
                    items: { type: 'string' },
                    description: "The collection for bgp community values to filter on. e.g. ['12076:5010','12076:5020']."
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the route filter rule resource.',
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
              location: { type: 'string', description: 'Resource location.' },
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
            description: 'Route Filter Rule Resource.'
          },
          description: 'Collection of RouteFilterRules contained within a route filter.'
        },
        peerings: {
          readOnly: true,
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
          description: 'A collection of references to express route circuit peerings.'
        },
        ipv6Peerings: {
          readOnly: true,
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
          description: 'A collection of references to express route circuit ipv6 peerings.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the route filter resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
  description: 'Route Filter Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/routeFilter.json).
