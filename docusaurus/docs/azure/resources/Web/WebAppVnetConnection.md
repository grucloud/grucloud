---
id: WebAppVnetConnection
title: WebAppVnetConnection
---
Provides a **WebAppVnetConnection** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Virtual Network information ARM resource.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Core resource properties',
      type: 'object',
      'x-ms-client-flatten': true,
      properties: {
        vnetResourceId: {
          description: "The Virtual Network's resource ID.",
          type: 'string'
        },
        certThumbprint: {
          description: 'The client certificate thumbprint.',
          type: 'string',
          readOnly: true
        },
        certBlob: {
          description: 'A certificate file (.cer) blob containing the public key of the private key used to authenticate a \n' +
            'Point-To-Site VPN connection.',
          type: 'string'
        },
        routes: {
          description: 'The routes that this Virtual Network connection uses.',
          type: 'array',
          items: {
            description: 'Virtual Network route contract used to pass routing information for a Virtual Network.',
            type: 'object',
            allOf: [
              {
                description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
                type: 'object',
                properties: {
                  id: {
                    description: 'Resource Id.',
                    type: 'string',
                    readOnly: true
                  },
                  name: {
                    description: 'Resource Name.',
                    type: 'string',
                    readOnly: true
                  },
                  kind: { description: 'Kind of resource.', type: 'string' },
                  type: {
                    description: 'Resource type.',
                    type: 'string',
                    readOnly: true
                  }
                },
                'x-ms-azure-resource': true
              }
            ],
            properties: {
              properties: {
                description: 'VnetRoute resource specific properties',
                type: 'object',
                properties: {
                  startAddress: {
                    description: 'The starting address for this route. This may also include a CIDR notation, in which case the end address must not be specified.',
                    type: 'string'
                  },
                  endAddress: {
                    description: 'The ending address for this route. If the start address is specified in CIDR notation, this must be omitted.',
                    type: 'string'
                  },
                  routeType: {
                    description: 'The type of route this is:\n' +
                      'DEFAULT - By default, every app has routes to the local address ranges specified by RFC1918\n' +
                      'INHERITED - Routes inherited from the real Virtual Network routes\n' +
                      'STATIC - Static route set on the app only\n' +
                      '\n' +
                      "These values will be used for syncing an app's routes with those from a Virtual Network.",
                    enum: [ 'DEFAULT', 'INHERITED', 'STATIC' ],
                    type: 'string',
                    'x-ms-enum': { name: 'RouteType', modelAsString: true }
                  }
                },
                'x-ms-client-flatten': true
              }
            }
          },
          readOnly: true
        },
        resyncRequired: {
          description: '<code>true</code> if a resync is required; otherwise, <code>false</code>.',
          type: 'boolean',
          readOnly: true
        },
        dnsServers: {
          description: 'DNS servers to be used by this Virtual Network. This should be a comma-separated list of IP addresses.',
          type: 'string'
        },
        isSwift: {
          description: 'Flag that is used to denote if this is VNET injection',
          type: 'boolean'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/WebApps.json).
