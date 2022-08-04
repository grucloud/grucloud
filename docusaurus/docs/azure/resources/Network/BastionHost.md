---
id: BastionHost
title: BastionHost
---
Provides a **BastionHost** from the **Network** group
## Examples
### Create Bastion Host
```js
exports.createResources = () => [
  {
    type: "BastionHost",
    group: "Network",
    name: "myBastionHost",
    properties: () => ({ name: "Standard" }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnet: ["mySubnet"],
      publicIpAddress: ["myPublicIPAddress"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Represents the bastion host resource.',
      properties: {
        ipConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Represents the ip configuration associated with the resource.',
                properties: {
                  subnet: {
                    description: 'Reference of the subnet resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  publicIPAddress: {
                    description: 'Reference of the PublicIP resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the bastion host IP configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  privateIPAllocationMethod: {
                    description: 'Private IP allocation method.',
                    type: 'string',
                    enum: [ 'Static', 'Dynamic' ],
                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                  }
                },
                required: [ 'subnet', 'publicIPAddress' ]
              },
              name: {
                type: 'string',
                description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
                type: 'string',
                readOnly: true,
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Ip configuration type.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'IP configuration of an Bastion Host.'
          },
          description: 'IP configuration of the Bastion Host resource.'
        },
        dnsName: {
          type: 'string',
          description: 'FQDN for the endpoint on which bastion host is accessible.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the bastion host resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        scaleUnits: {
          type: 'integer',
          format: 'int32',
          description: 'The scale units for the Bastion Host resource.',
          minimum: 2,
          maximum: 50
        },
        disableCopyPaste: {
          type: 'boolean',
          default: false,
          description: 'Enable/Disable Copy/Paste feature of the Bastion Host resource.'
        },
        enableFileCopy: {
          type: 'boolean',
          default: false,
          description: 'Enable/Disable File Copy feature of the Bastion Host resource.'
        },
        enableIpConnect: {
          type: 'boolean',
          default: false,
          description: 'Enable/Disable IP Connect feature of the Bastion Host resource.'
        },
        enableShareableLink: {
          type: 'boolean',
          default: false,
          description: 'Enable/Disable Shareable Link of the Bastion Host resource.'
        },
        enableTunneling: {
          type: 'boolean',
          default: false,
          description: 'Enable/Disable Tunneling feature of the Bastion Host resource.'
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    sku: {
      description: 'The sku of this Bastion Host.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of this Bastion Host.',
          enum: [ 'Basic', 'Standard' ],
          default: 'Standard',
          'x-ms-enum': { name: 'BastionHostSkuName', modelAsString: true }
        }
      },
      type: 'object'
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
  description: 'Bastion Host resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/bastionHost.json).
