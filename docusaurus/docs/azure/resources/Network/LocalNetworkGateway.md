---
id: LocalNetworkGateway
title: LocalNetworkGateway
---
Provides a **LocalNetworkGateway** from the **Network** group
## Examples
### CreateLocalNetworkGateway
```js
provider.Network.makeLocalNetworkGateway({
  name: "myLocalNetworkGateway",
  properties: () => ({
    properties: {
      localNetworkAddressSpace: { addressPrefixes: ["10.1.0.0/16"] },
      gatewayIpAddress: "11.12.13.14",
      fqdn: "site1.contoso.com",
    },
    location: "Central US",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHubIpConfiguration:
      resources.Network.VirtualHubIpConfiguration[
        "myVirtualHubIpConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the local network gateway.',
      properties: {
        localNetworkAddressSpace: {
          description: 'Local network site address space.',
          properties: {
            addressPrefixes: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of address blocks reserved for this virtual network in CIDR notation.'
            }
          }
        },
        gatewayIpAddress: {
          type: 'string',
          description: 'IP address of local network gateway.'
        },
        fqdn: {
          type: 'string',
          description: 'FQDN of local network gateway.'
        },
        bgpSettings: {
          description: "Local network gateway's BGP speaker settings.",
          properties: {
            asn: {
              type: 'integer',
              format: 'int64',
              minimum: 0,
              maximum: 4294967295,
              description: "The BGP speaker's ASN."
            },
            bgpPeeringAddress: {
              type: 'string',
              description: 'The BGP peering address and BGP identifier of this BGP speaker.'
            },
            peerWeight: {
              type: 'integer',
              format: 'int32',
              description: 'The weight added to routes learned from this BGP speaker.'
            },
            bgpPeeringAddresses: {
              type: 'array',
              items: {
                properties: {
                  ipconfigurationId: {
                    type: 'string',
                    description: 'The ID of IP configuration which belongs to gateway.'
                  },
                  defaultBgpIpAddresses: {
                    readOnly: true,
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The list of default BGP peering addresses which belong to IP configuration.'
                  },
                  customBgpIpAddresses: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The list of custom BGP peering addresses which belong to IP configuration.'
                  },
                  tunnelIpAddresses: {
                    readOnly: true,
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The list of tunnel public IP addresses which belong to IP configuration.'
                  }
                },
                description: 'Properties of IPConfigurationBgpPeeringAddress.'
              },
              description: 'BGP peering address with IP configuration ID for virtual network gateway.'
            }
          }
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the local network gateway resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the local network gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
  required: [ 'properties' ],
  description: 'A common class for general resource information.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkGateway.json).
