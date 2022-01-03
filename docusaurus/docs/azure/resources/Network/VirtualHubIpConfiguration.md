---
id: VirtualHubIpConfiguration
title: VirtualHubIpConfiguration
---
Provides a **VirtualHubIpConfiguration** from the **Network** group
## Examples
### VirtualHubIpConfigurationPut
```js
provider.Network.makeVirtualHubIpConfiguration({
  name: "myVirtualHubIpConfiguration",
  properties: () => ({
    properties: {
      subnet: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
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
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
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
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the Virtual Hub IPConfigurations.',
      properties: {
        privateIPAddress: {
          type: 'string',
          description: 'The private IP address of the IP configuration.'
        },
        privateIPAllocationMethod: {
          description: 'The private IP address allocation method.',
          type: 'string',
          enum: [ 'Static', 'Dynamic' ],
          'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
        },
        subnet: {
          description: 'The reference to the subnet resource.',
          properties: {
            properties: {
              'x-ms-client-flatten': true,
              description: 'Properties of the subnet.',
              properties: {
                addressPrefix: {
                  type: 'string',
                  description: 'The address prefix for the subnet.'
                },
                addressPrefixes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of address prefixes for the subnet.'
                },
                networkSecurityGroup: {
                  description: 'The reference to the NetworkSecurityGroup resource.',
                  properties: {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Properties of the network security group.',
                      properties: [Object]
                    },
                    etag: {
                      readOnly: true,
                      type: 'string',
                      description: 'A unique read-only string that changes whenever the resource is updated.'
                    }
                  },
                  allOf: [
                    {
                      properties: [Object],
                      description: 'Common resource representation.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                routeTable: {
                  description: 'The reference to the RouteTable resource.',
                  properties: {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Properties of the route table.',
                      properties: [Object]
                    },
                    etag: {
                      readOnly: true,
                      type: 'string',
                      description: 'A unique read-only string that changes whenever the resource is updated.'
                    }
                  },
                  allOf: [
                    {
                      properties: [Object],
                      description: 'Common resource representation.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                natGateway: {
                  properties: {
                    id: { type: 'string', description: 'Resource ID.' }
                  },
                  description: 'Reference to another subresource.',
                  'x-ms-azure-resource': true
                },
                serviceEndpoints: {
                  type: 'array',
                  items: {
                    properties: {
                      service: [Object],
                      locations: [Object],
                      provisioningState: [Object]
                    },
                    description: 'The service endpoint properties.'
                  },
                  description: 'An array of service endpoints.'
                },
                serviceEndpointPolicies: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      etag: [Object],
                      kind: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Service End point policy resource.'
                  },
                  description: 'An array of service endpoint policies.'
                },
                privateEndpoints: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      extendedLocation: [Object],
                      properties: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Private endpoint resource.'
                  },
                  description: 'An array of references to private endpoints.'
                },
                ipConfigurations: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'IP configuration.'
                  },
                  description: 'An array of references to the network interface IP configurations using subnet.'
                },
                ipConfigurationProfiles: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      type: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'IP configuration profile child resource.'
                  },
                  description: 'Array of IP configuration profiles which reference this subnet.'
                },
                ipAllocations: {
                  type: 'array',
                  items: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  description: 'Array of IpAllocation which reference this subnet.'
                },
                resourceNavigationLinks: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      id: [Object],
                      etag: [Object],
                      type: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'ResourceNavigationLink resource.'
                  },
                  description: 'An array of references to the external resources using subnet.'
                },
                serviceAssociationLinks: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      etag: [Object],
                      type: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'ServiceAssociationLink resource.'
                  },
                  description: 'An array of references to services injecting into this subnet.'
                },
                delegations: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      etag: [Object],
                      type: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Details the service to which the subnet is delegated.'
                  },
                  description: 'An array of references to the delegations on the subnet.'
                },
                purpose: {
                  type: 'string',
                  readOnly: true,
                  description: 'A read-only string identifying the intention of use for this subnet based on delegations and other user-defined properties.'
                },
                provisioningState: {
                  readOnly: true,
                  description: 'The provisioning state of the subnet resource.',
                  type: 'string',
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                },
                privateEndpointNetworkPolicies: {
                  type: 'string',
                  default: 'Enabled',
                  description: 'Enable or Disable apply network policies on private end point in the subnet.',
                  enum: [ 'Enabled', 'Disabled' ],
                  'x-ms-enum': {
                    name: 'VirtualNetworkPrivateEndpointNetworkPolicies',
                    modelAsString: true
                  }
                },
                privateLinkServiceNetworkPolicies: {
                  type: 'string',
                  default: 'Enabled',
                  description: 'Enable or Disable apply network policies on private link service in the subnet.',
                  enum: [ 'Enabled', 'Disabled' ],
                  'x-ms-enum': {
                    name: 'VirtualNetworkPrivateLinkServiceNetworkPolicies',
                    modelAsString: true
                  }
                },
                applicationGatewayIpConfigurations: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      etag: [Object],
                      type: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
                  },
                  description: 'Application gateway IP configurations of virtual network resource.'
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
            type: { type: 'string', description: 'Resource type.' }
          },
          allOf: [
            {
              properties: { id: { type: 'string', description: 'Resource ID.' } },
              description: 'Reference to another subresource.',
              'x-ms-azure-resource': true
            }
          ]
        },
        publicIPAddress: {
          description: 'The reference to the public IP resource.',
          properties: <ref *1> {
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
                  'x-ms-enum': {
                    name: 'ExtendedLocationTypes',
                    modelAsString: true
                  }
                }
              }
            },
            sku: {
              description: 'The public IP address SKU.',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of a public IP address SKU.',
                  enum: [ 'Basic', 'Standard' ],
                  'x-ms-enum': {
                    name: 'PublicIPAddressSkuName',
                    modelAsString: true
                  }
                },
                tier: {
                  type: 'string',
                  description: 'Tier of a public IP address SKU.',
                  enum: [ 'Regional', 'Global' ],
                  'x-ms-enum': {
                    name: 'PublicIPAddressSkuTier',
                    modelAsString: true
                  }
                }
              }
            },
            properties: {
              'x-ms-client-flatten': true,
              description: 'Public IP address properties.',
              properties: {
                publicIPAllocationMethod: {
                  description: 'The public IP address allocation method.',
                  type: 'string',
                  enum: [ 'Static', 'Dynamic' ],
                  'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                },
                publicIPAddressVersion: {
                  description: 'The public IP address version.',
                  type: 'string',
                  enum: [ 'IPv4', 'IPv6' ],
                  'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                },
                ipConfiguration: {
                  readOnly: true,
                  description: 'The IP configuration associated with the public IP address.',
                  properties: {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Properties of the IP configuration.',
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
                    }
                  },
                  allOf: [
                    {
                      properties: [Object],
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                dnsSettings: {
                  description: 'The FQDN of the DNS record associated with the public IP address.',
                  properties: {
                    domainNameLabel: {
                      type: 'string',
                      description: 'The domain name label. The concatenation of the domain name label and the regionalized DNS zone make up the fully qualified domain name associated with the public IP address. If a domain name label is specified, an A DNS record is created for the public IP in the Microsoft Azure DNS system.'
                    },
                    fqdn: {
                      type: 'string',
                      description: 'The Fully Qualified Domain Name of the A DNS record associated with the public IP. This is the concatenation of the domainNameLabel and the regionalized DNS zone.'
                    },
                    reverseFqdn: {
                      type: 'string',
                      description: 'The reverse FQDN. A user-visible, fully qualified domain name that resolves to this public IP address. If the reverseFqdn is specified, then a PTR DNS record is created pointing from the IP address in the in-addr.arpa domain to the reverse FQDN.'
                    }
                  }
                },
                ddosSettings: {
                  description: 'The DDoS protection custom policy associated with the public IP address.',
                  properties: {
                    ddosCustomPolicy: {
                      properties: [Object],
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true,
                      readOnly: false
                    },
                    protectionCoverage: {
                      readOnly: false,
                      type: 'string',
                      enum: [Array],
                      'x-ms-enum': [Object],
                      description: 'The DDoS protection policy customizability of the public IP. Only standard coverage will have the ability to be customized.'
                    },
                    protectedIP: {
                      readOnly: false,
                      type: 'boolean',
                      description: 'Enables DDoS protection on the public IP.'
                    }
                  }
                },
                ipTags: {
                  type: 'array',
                  items: {
                    properties: { ipTagType: [Object], tag: [Object] },
                    description: 'Contains the IpTag associated with the object.'
                  },
                  description: 'The list of tags associated with the public IP address.'
                },
                ipAddress: {
                  type: 'string',
                  description: 'The IP address associated with the public IP address resource.'
                },
                publicIPPrefix: {
                  properties: {
                    id: { type: 'string', description: 'Resource ID.' }
                  },
                  description: 'Reference to another subresource.',
                  'x-ms-azure-resource': true
                },
                idleTimeoutInMinutes: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The idle timeout of the public IP address.'
                },
                resourceGuid: {
                  readOnly: true,
                  type: 'string',
                  description: 'The resource GUID property of the public IP address resource.'
                },
                provisioningState: {
                  readOnly: true,
                  description: 'The provisioning state of the public IP address resource.',
                  type: 'string',
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                },
                servicePublicIPAddress: {
                  description: 'The service public IP address of the public IP address resource.',
                  properties: [Circular *1],
                  allOf: [
                    {
                      properties: [Object],
                      description: 'Common resource representation.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                natGateway: {
                  description: 'The NatGateway for the Public IP address.',
                  properties: {
                    sku: {
                      description: 'The nat gateway SKU.',
                      properties: [Object]
                    },
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Nat Gateway properties.',
                      properties: [Object]
                    },
                    zones: {
                      type: 'array',
                      items: [Object],
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
                      properties: [Object],
                      description: 'Common resource representation.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                migrationPhase: {
                  type: 'string',
                  description: 'Migration phase of Public IP Address.',
                  enum: [ 'None', 'Prepare', 'Commit', 'Abort', 'Committed' ],
                  'x-ms-enum': {
                    name: 'PublicIPAddressMigrationPhase',
                    modelAsString: true
                  }
                },
                linkedPublicIPAddress: {
                  description: 'The linked public IP address of the public IP address resource.',
                  properties: [Circular *1],
                  allOf: [
                    {
                      properties: [Object],
                      description: 'Common resource representation.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                deleteOption: {
                  type: 'string',
                  description: 'Specify what happens to the public IP address when the VM using it is deleted',
                  enum: [ 'Delete', 'Detach' ],
                  'x-ms-enum': { name: 'DeleteOptions', modelAsString: true }
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
          ]
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the IP configuration resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    name: { type: 'string', description: 'Name of the Ip Configuration.' },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: {
      type: 'string',
      readOnly: true,
      description: 'Ipconfiguration type.'
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'IpConfigurations.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
