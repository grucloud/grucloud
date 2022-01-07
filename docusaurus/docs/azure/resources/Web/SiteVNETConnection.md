---
id: SiteVNETConnection
title: SiteVNETConnection
---
Provides a **SiteVNETConnection** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'VNETInfo contract. This contract is public and is a stripped down version of VNETInfoInternal',
  type: 'object',
  allOf: [
    {
      required: [ 'location' ],
      properties: {
        id: { description: 'Resource Id', type: 'string' },
        name: { description: 'Resource Name', type: 'string' },
        kind: { description: 'Kind of resource', type: 'string' },
        location: { description: 'Resource Location', type: 'string' },
        type: { description: 'Resource type', type: 'string' },
        tags: {
          description: 'Resource tags',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      properties: {
        vnetResourceId: { description: 'The vnet resource id', type: 'string' },
        certThumbprint: {
          description: 'The client certificate thumbprint',
          type: 'string'
        },
        certBlob: {
          description: 'A certificate file (.cer) blob containing the public key of the private key used to authenticate a \r\n' +
            '            Point-To-Site VPN connection.',
          type: 'string'
        },
        routes: {
          description: 'The routes that this virtual network connection uses.',
          type: 'array',
          items: {
            description: 'VnetRoute contract used to pass routing information for a vnet.',
            type: 'object',
            allOf: [
              {
                required: [ 'location' ],
                properties: {
                  id: { description: 'Resource Id', type: 'string' },
                  name: { description: 'Resource Name', type: 'string' },
                  kind: { description: 'Kind of resource', type: 'string' },
                  location: { description: 'Resource Location', type: 'string' },
                  type: { description: 'Resource type', type: 'string' },
                  tags: {
                    description: 'Resource tags',
                    type: 'object',
                    additionalProperties: { type: 'string' }
                  }
                },
                'x-ms-azure-resource': true
              }
            ],
            properties: {
              properties: {
                properties: {
                  name: {
                    description: 'The name of this route. This is only returned by the server and does not need to be set by the client.',
                    type: 'string'
                  },
                  startAddress: {
                    description: 'The starting address for this route. This may also include a CIDR notation, in which case the end address must not be specified.',
                    type: 'string'
                  },
                  endAddress: {
                    description: 'The ending address for this route. If the start address is specified in CIDR notation, this must be omitted.',
                    type: 'string'
                  },
                  routeType: {
                    description: 'The type of route this is:\r\n' +
                      '            DEFAULT - By default, every web app has routes to the local address ranges specified by RFC1918\r\n' +
                      '            INHERITED - Routes inherited from the real Virtual Network routes\r\n' +
                      '            STATIC - Static route set on the web app only\r\n' +
                      '            \r\n' +
                      "            These values will be used for syncing a Web App's routes with those from a Virtual Network. This operation will clear all DEFAULT and INHERITED routes and replace them\r\n" +
                      '            with new INHERITED routes.',
                    type: 'string'
                  }
                },
                'x-ms-client-flatten': true
              }
            }
          }
        },
        resyncRequired: {
          description: 'Flag to determine if a resync is required',
          type: 'boolean'
        },
        dnsServers: {
          description: 'Dns servers to be used by this VNET. This should be a comma-separated list of IP addresses.',
          type: 'string'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
