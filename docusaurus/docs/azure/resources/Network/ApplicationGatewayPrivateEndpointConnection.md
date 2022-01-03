---
id: ApplicationGatewayPrivateEndpointConnection
title: ApplicationGatewayPrivateEndpointConnection
---
Provides a **ApplicationGatewayPrivateEndpointConnection** from the **Network** group
## Examples
### Update Application Gateway Private Endpoint Connection
```js
provider.Network.makeApplicationGatewayPrivateEndpointConnection({
  name: "myApplicationGatewayPrivateEndpointConnection",
  properties: () => ({
    name: "connection1",
    properties: {
      privateEndpoint: {
        id: "/subscriptions/subId2/resourceGroups/rg1/providers/Microsoft.Network/privateEndpoints/testPe",
      },
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "approved it for some reason.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    privateLinkService:
      resources.Network.PrivateLinkService["myPrivateLinkService"],
    applicationGateway:
      resources.Network.ApplicationGateway["myApplicationGateway"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [NatGateway](../Network/NatGateway.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [PrivateLinkService](../Network/PrivateLinkService.md)
- [ApplicationGateway](../Network/ApplicationGateway.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the application gateway private endpoint connection.',
      properties: {
        privateEndpoint: {
          properties: {
            extendedLocation: {
              description: 'The extended location of the load balancer.',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the extended location.'
                },
                type: {
                  description: 'The type of the extended location.',
                  type: 'string',
                  enum: [ 'EdgeZone' ],
                  'x-ms-enum': {
                    name: 'ExtendedLocationTypes',
                    modelAsString: true
                  }
                }
              }
            },
            properties: {
              'x-ms-client-flatten': true,
              description: 'Properties of the private endpoint.',
              properties: {
                subnet: {
                  description: 'The ID of the subnet from which the private IP will be allocated.',
                  properties: {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Properties of the subnet.',
                      properties: [Object]
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
                    type: { type: 'string', description: 'Resource type.' }
                  },
                  allOf: [
                    {
                      properties: [Object],
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                networkInterfaces: {
                  type: 'array',
                  readOnly: true,
                  items: {
                    properties: {
                      extendedLocation: [Object],
                      properties: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'A network interface in a resource group.'
                  },
                  description: 'An array of references to the network interfaces created for this private endpoint.'
                },
                provisioningState: {
                  readOnly: true,
                  description: 'The provisioning state of the private endpoint resource.',
                  type: 'string',
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                },
                privateLinkServiceConnections: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      type: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'PrivateLinkServiceConnection resource.'
                  },
                  description: 'A grouping of information about the connection to the remote resource.'
                },
                manualPrivateLinkServiceConnections: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      type: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'PrivateLinkServiceConnection resource.'
                  },
                  description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                },
                customDnsConfigs: {
                  type: 'array',
                  items: {
                    properties: { fqdn: [Object], ipAddresses: [Object] },
                    description: 'Contains custom Dns resolution configuration from customer.'
                  },
                  description: 'An array of custom dns configurations.'
                },
                applicationSecurityGroups: {
                  type: 'array',
                  items: {
                    properties: { properties: [Object], etag: [Object] },
                    allOf: [ [Object] ],
                    description: 'An application security group in a resource group.'
                  },
                  description: 'Application security groups in which the private endpoint IP configuration is included.'
                },
                ipConfigurations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      properties: [Object],
                      name: [Object],
                      type: [Object],
                      etag: [Object]
                    },
                    description: 'An IP Configuration of the private endpoint.'
                  },
                  description: "A list of IP configurations of the private endpoint. This will be used to map to the First Party Service's endpoints."
                },
                customNetworkInterfaceName: {
                  type: 'string',
                  description: 'The custom name of the network interface attached to the private endpoint.'
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
          description: 'Private endpoint resource.',
          readOnly: true
        },
        privateLinkServiceConnectionState: {
          description: 'A collection of information about the state of the connection between service consumer and provider.',
          properties: {
            status: {
              type: 'string',
              description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.'
            },
            description: {
              type: 'string',
              description: 'The reason for approval/rejection of the connection.'
            },
            actionsRequired: {
              type: 'string',
              description: 'A message indicating if changes on the service provider require any updates on the consumer.'
            }
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the application gateway private endpoint connection resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        linkIdentifier: {
          readOnly: true,
          type: 'string',
          description: 'The consumer link id.'
        }
      }
    },
    name: {
      type: 'string',
      description: 'Name of the private endpoint connection on an application gateway.'
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
  description: 'Private Endpoint connection on an application gateway.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/applicationGateway.json).
