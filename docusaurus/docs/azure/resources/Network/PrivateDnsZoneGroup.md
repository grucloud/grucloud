---
id: PrivateDnsZoneGroup
title: PrivateDnsZoneGroup
---
Provides a **PrivateDnsZoneGroup** from the **Network** group
## Examples
### Create private dns zone group
```js
exports.createResources = () => [
  {
    type: "PrivateDnsZoneGroup",
    group: "Network",
    name: "myPrivateDnsZoneGroup",
    properties: () => ({
      properties: {
        privateDnsZoneConfigs: [
          {
            properties: {
              privateDnsZoneId:
                "/subscriptions/subId/resourceGroups/rg1/providers/Microsoft.Network/privateDnsZones/zone1.com",
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      privateEndpoint: "myPrivateEndpoint",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpoint](../Network/PrivateEndpoint.md)
## Swagger Schema
```js
{
  properties: {
    name: {
      type: 'string',
      description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the private dns zone group.',
      properties: {
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the private dns zone group resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        privateDnsZoneConfigs: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the private dns zone configuration.',
                properties: {
                  privateDnsZoneId: {
                    type: 'string',
                    description: 'The resource id of the private dns zone.'
                  },
                  recordSets: {
                    type: 'array',
                    readOnly: true,
                    items: {
                      properties: {
                        recordType: {
                          type: 'string',
                          description: 'Resource record type.'
                        },
                        recordSetName: {
                          type: 'string',
                          description: 'Recordset name.'
                        },
                        fqdn: {
                          type: 'string',
                          description: 'Fqdn that resolves to private endpoint ip address.'
                        },
                        provisioningState: {
                          readOnly: true,
                          description: 'The provisioning state of the recordset.',
                          type: 'string',
                          enum: [
                            'Succeeded',
                            'Updating',
                            'Deleting',
                            'Failed'
                          ],
                          'x-ms-enum': {
                            name: 'ProvisioningState',
                            modelAsString: true
                          }
                        },
                        ttl: {
                          type: 'integer',
                          description: 'Recordset time to live.'
                        },
                        ipAddresses: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'The private ip address of the private endpoint.'
                        }
                      },
                      description: 'A collective group of information about the record set information.'
                    },
                    description: 'A collection of information regarding a recordSet, holding information to identify private resources.'
                  }
                }
              }
            },
            description: 'PrivateDnsZoneConfig resource.'
          },
          description: 'A collection of private dns zone configurations of the private dns zone group.'
        }
      }
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Private dns zone group resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/privateEndpoint.json).
