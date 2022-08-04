---
id: PublicIPPrefix
title: PublicIPPrefix
---
Provides a **PublicIPPrefix** from the **Network** group
## Examples
### Create public IP prefix defaults
```js
exports.createResources = () => [
  {
    type: "PublicIPPrefix",
    group: "Network",
    name: "myPublicIPPrefix",
    properties: () => ({
      location: "westus",
      properties: { prefixLength: 30 },
      sku: { name: "Standard" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      loadBalancer: "myLoadBalancer",
      customIpPrefix: "myCustomIPPrefix",
    }),
  },
];

```

### Create public IP prefix allocation method
```js
exports.createResources = () => [
  {
    type: "PublicIPPrefix",
    group: "Network",
    name: "myPublicIPPrefix",
    properties: () => ["1"],
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      loadBalancer: "myLoadBalancer",
      customIpPrefix: "myCustomIPPrefix",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [LoadBalancer](../Network/LoadBalancer.md)
- [CustomIPPrefix](../Network/CustomIPPrefix.md)
## Swagger Schema
```js
{
  properties: {
    extendedLocation: {
      description: 'The extended location of the public ip address.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    },
    sku: {
      description: 'The public IP prefix SKU.',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a public IP prefix SKU.',
          enum: [ 'Standard' ],
          'x-ms-enum': { name: 'PublicIPPrefixSkuName', modelAsString: true }
        },
        tier: {
          type: 'string',
          description: 'Tier of a public IP prefix SKU.',
          enum: [ 'Regional', 'Global' ],
          'x-ms-enum': { name: 'PublicIPPrefixSkuTier', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Public IP prefix properties.',
      properties: {
        publicIPAddressVersion: {
          description: 'The public IP address version.',
          type: 'string',
          enum: [ 'IPv4', 'IPv6' ],
          'x-ms-enum': { name: 'IPVersion', modelAsString: true }
        },
        ipTags: {
          type: 'array',
          items: {
            properties: {
              ipTagType: {
                type: 'string',
                description: 'The IP tag type. Example: FirstPartyUsage.'
              },
              tag: {
                type: 'string',
                description: 'The value of the IP tag associated with the public IP. Example: SQL.'
              }
            },
            description: 'Contains the IpTag associated with the object.'
          },
          description: 'The list of tags associated with the public IP prefix.'
        },
        prefixLength: {
          type: 'integer',
          format: 'int32',
          description: 'The Length of the Public IP Prefix.'
        },
        ipPrefix: {
          readOnly: true,
          type: 'string',
          description: 'The allocated Prefix.'
        },
        publicIPAddresses: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'string',
                description: 'The PublicIPAddress Reference.'
              }
            },
            description: 'Reference to a public IP address.'
          },
          description: 'The list of all referenced PublicIPAddresses.'
        },
        loadBalancerFrontendIpConfiguration: {
          readOnly: true,
          description: 'The reference to load balancer frontend IP configuration associated with the public IP prefix.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        customIPPrefix: {
          description: 'The customIpPrefix that this prefix is associated with.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the public IP prefix resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the public IP prefix resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        natGateway: {
          description: 'NatGateway of Public IP Prefix.',
          properties: {
            sku: {
              description: 'The nat gateway SKU.',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of Nat Gateway SKU.',
                  enum: [ 'Standard' ],
                  'x-ms-enum': { name: 'NatGatewaySkuName', modelAsString: true }
                }
              }
            },
            properties: {
              'x-ms-client-flatten': true,
              description: 'Nat Gateway properties.',
              properties: {
                idleTimeoutInMinutes: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The idle timeout of the nat gateway.'
                },
                publicIpAddresses: {
                  type: 'array',
                  items: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  description: 'An array of public ip addresses associated with the nat gateway resource.'
                },
                publicIpPrefixes: {
                  type: 'array',
                  items: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  description: 'An array of public ip prefixes associated with the nat gateway resource.'
                },
                subnets: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  description: 'An array of references to the subnets using this nat gateway resource.'
                },
                resourceGuid: {
                  readOnly: true,
                  type: 'string',
                  description: 'The resource GUID property of the NAT gateway resource.'
                },
                provisioningState: {
                  readOnly: true,
                  description: 'The provisioning state of the NAT gateway resource.',
                  type: 'string',
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                }
              }
            },
            zones: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of availability zones denoting the zone in which Nat Gateway should be deployed.'
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
          ]
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
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
  description: 'Public IP prefix resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/publicIpPrefix.json).
