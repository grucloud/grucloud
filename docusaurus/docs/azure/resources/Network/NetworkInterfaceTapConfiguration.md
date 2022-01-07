---
id: NetworkInterfaceTapConfiguration
title: NetworkInterfaceTapConfiguration
---
Provides a **NetworkInterfaceTapConfiguration** from the **Network** group
## Examples
### Create Network Interface Tap Configurations
```js
provider.Network.makeNetworkInterfaceTapConfiguration({
  name: "myNetworkInterfaceTapConfiguration",
  properties: () => ({
    properties: {
      virtualNetworkTap: {
        id: "/subscriptions/subid/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworkTaps/testvtap",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    loadBalancer: resources.Network.LoadBalancer["myLoadBalancer"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    networkInterface: resources.Network.NetworkInterface["myNetworkInterface"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [LoadBalancer](../Network/LoadBalancer.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [LoadBalancerBackendAddressPool](../Network/LoadBalancerBackendAddressPool.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [NetworkInterface](../Network/NetworkInterface.md)
## Swagger Schema
```js
{
  properties: <ref *1> {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the Virtual Network Tap configuration.',
      properties: {
        virtualNetworkTap: {
          description: 'The reference to the Virtual Network Tap resource.',
          properties: <ref *2> {
            properties: {
              'x-ms-client-flatten': true,
              description: 'Virtual Network Tap Properties.',
              properties: {
                networkInterfaceTapConfigurations: {
                  readOnly: true,
                  type: 'array',
                  items: {
                    description: 'The reference to the Network Interface.',
                    properties: [Circular *1],
                    allOf: [
                      {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
                        description: 'Reference to another subresource.',
                        'x-ms-azure-resource': true
                      }
                    ]
                  },
                  description: 'Specifies the list of resource IDs for the network interface IP configuration that needs to be tapped.'
                },
                resourceGuid: {
                  type: 'string',
                  readOnly: true,
                  description: 'The resource GUID property of the virtual network tap resource.'
                },
                provisioningState: {
                  readOnly: true,
                  description: 'The provisioning state of the virtual network tap resource.',
                  type: 'string',
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                },
                destinationNetworkInterfaceIPConfiguration: {
                  description: 'The reference to the private IP Address of the collector nic that will receive the tap.',
                  properties: {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Network interface IP configuration properties.',
                      properties: {
                        gatewayLoadBalancer: {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        },
                        virtualNetworkTaps: {
                          type: 'array',
                          items: {
                            properties: [Circular *2],
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ],
                            description: 'Virtual Network Tap resource.'
                          },
                          description: 'The reference to Virtual Network Taps.'
                        },
                        applicationGatewayBackendAddressPools: {
                          type: 'array',
                          items: {
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the application gateway backend address pool.',
                                properties: [Object]
                              },
                              name: {
                                type: 'string',
                                description: 'Name of the backend address pool that is unique within an Application Gateway.'
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
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ],
                            description: 'Backend Address Pool of an application gateway.'
                          },
                          description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                        },
                        loadBalancerBackendAddressPools: {
                          type: 'array',
                          items: {
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of load balancer backend address pool.',
                                properties: [Object]
                              },
                              name: {
                                type: 'string',
                                description: 'The name of the resource that is unique within the set of backend address pools used by the load balancer. This name can be used to access the resource.'
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
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ],
                            description: 'Pool of backend IP addresses.'
                          },
                          description: 'The reference to LoadBalancerBackendAddressPool resource.'
                        },
                        loadBalancerInboundNatRules: {
                          type: 'array',
                          items: {
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of load balancer inbound NAT rule.',
                                properties: [Object]
                              },
                              name: {
                                type: 'string',
                                description: 'The name of the resource that is unique within the set of inbound NAT rules used by the load balancer. This name can be used to access the resource.'
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
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ],
                            description: 'Inbound NAT rule of the load balancer.'
                          },
                          description: 'A list of references of LoadBalancerInboundNatRules.'
                        },
                        privateIPAddress: {
                          type: 'string',
                          description: 'Private IP address of the IP configuration.'
                        },
                        privateIPAllocationMethod: {
                          description: 'The private IP address allocation method.',
                          type: 'string',
                          enum: [ 'Static', 'Dynamic' ],
                          'x-ms-enum': {
                            name: 'IPAllocationMethod',
                            modelAsString: true
                          }
                        },
                        privateIPAddressVersion: {
                          description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                          type: 'string',
                          enum: [ 'IPv4', 'IPv6' ],
                          'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                        },
                        subnet: {
                          properties: {
                            properties: {
                              'x-ms-client-flatten': true,
                              description: 'Properties of the subnet.',
                              properties: {
                                addressPrefix: [Object],
                                addressPrefixes: [Object],
                                networkSecurityGroup: [Object],
                                routeTable: [Object],
                                natGateway: [Object],
                                serviceEndpoints: [Object],
                                serviceEndpointPolicies: [Object],
                                privateEndpoints: [Object],
                                ipConfigurations: [Object],
                                ipConfigurationProfiles: [Object],
                                ipAllocations: [Object],
                                resourceNavigationLinks: [Object],
                                serviceAssociationLinks: [Object],
                                delegations: [Object],
                                purpose: [Object],
                                provisioningState: [Object],
                                privateEndpointNetworkPolicies: [Object],
                                privateLinkServiceNetworkPolicies: [Object],
                                applicationGatewayIpConfigurations: [Object]
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
                              type: 'string',
                              description: 'Resource type.'
                            }
                          },
                          allOf: [
                            {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            }
                          ],
                          description: 'Subnet in a virtual network resource.'
                        },
                        primary: {
                          type: 'boolean',
                          description: 'Whether this is a primary customer address on the network interface.'
                        },
                        publicIPAddress: {
                          description: 'Public IP address bound to the IP configuration.',
                          properties: {
                            extendedLocation: {
                              description: 'The extended location of the public ip address.',
                              properties: { name: [Object], type: [Object] }
                            },
                            sku: {
                              description: 'The public IP address SKU.',
                              properties: { name: [Object], tier: [Object] }
                            },
                            properties: {
                              'x-ms-client-flatten': true,
                              description: 'Public IP address properties.',
                              properties: {
                                publicIPAllocationMethod: [Object],
                                publicIPAddressVersion: [Object],
                                ipConfiguration: [Object],
                                dnsSettings: [Object],
                                ddosSettings: [Object],
                                ipTags: [Object],
                                ipAddress: [Object],
                                publicIPPrefix: [Object],
                                idleTimeoutInMinutes: [Object],
                                resourceGuid: [Object],
                                provisioningState: [Object],
                                servicePublicIPAddress: [Object],
                                natGateway: [Object],
                                migrationPhase: [Object],
                                linkedPublicIPAddress: [Object],
                                deleteOption: [Object]
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
                                id: [Object],
                                name: [Object],
                                type: [Object],
                                location: [Object],
                                tags: [Object]
                              },
                              description: 'Common resource representation.',
                              'x-ms-azure-resource': true
                            }
                          ]
                        },
                        applicationSecurityGroups: {
                          type: 'array',
                          items: {
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the application security group.',
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
                            ],
                            description: 'An application security group in a resource group.'
                          },
                          description: 'Application security groups in which the IP configuration is included.'
                        },
                        provisioningState: {
                          readOnly: true,
                          description: 'The provisioning state of the network interface IP configuration.',
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
                        privateLinkConnectionProperties: {
                          description: 'PrivateLinkConnection properties for the network interface.',
                          readOnly: true,
                          properties: {
                            groupId: {
                              type: 'string',
                              readOnly: true,
                              description: 'The group ID for current private link connection.'
                            },
                            requiredMemberName: {
                              type: 'string',
                              readOnly: true,
                              description: 'The required member name for current private link connection.'
                            },
                            fqdns: {
                              type: 'array',
                              items: { type: 'string' },
                              readOnly: true,
                              description: 'List of FQDNs for current private link connection.'
                            }
                          }
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
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                destinationLoadBalancerFrontEndIPConfiguration: {
                  description: 'The reference to the private IP address on the internal Load Balancer that will receive the tap.',
                  properties: {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Properties of the load balancer probe.',
                      properties: {
                        inboundNatRules: {
                          readOnly: true,
                          type: 'array',
                          items: {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            description: 'Reference to another subresource.',
                            'x-ms-azure-resource': true
                          },
                          description: 'An array of references to inbound rules that use this frontend IP.'
                        },
                        inboundNatPools: {
                          readOnly: true,
                          type: 'array',
                          items: {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            description: 'Reference to another subresource.',
                            'x-ms-azure-resource': true
                          },
                          description: 'An array of references to inbound pools that use this frontend IP.'
                        },
                        outboundRules: {
                          readOnly: true,
                          type: 'array',
                          items: {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            description: 'Reference to another subresource.',
                            'x-ms-azure-resource': true
                          },
                          description: 'An array of references to outbound rules that use this frontend IP.'
                        },
                        loadBalancingRules: {
                          readOnly: true,
                          type: 'array',
                          items: {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            description: 'Reference to another subresource.',
                            'x-ms-azure-resource': true
                          },
                          description: 'An array of references to load balancing rules that use this frontend IP.'
                        },
                        privateIPAddress: {
                          type: 'string',
                          description: 'The private IP address of the IP configuration.'
                        },
                        privateIPAllocationMethod: {
                          description: 'The Private IP allocation method.',
                          type: 'string',
                          enum: [ 'Static', 'Dynamic' ],
                          'x-ms-enum': {
                            name: 'IPAllocationMethod',
                            modelAsString: true
                          }
                        },
                        privateIPAddressVersion: {
                          description: 'Whether the specific ipconfiguration is IPv4 or IPv6. Default is taken as IPv4.',
                          type: 'string',
                          enum: [ 'IPv4', 'IPv6' ],
                          'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                        },
                        subnet: {
                          properties: {
                            properties: {
                              'x-ms-client-flatten': true,
                              description: 'Properties of the subnet.',
                              properties: {
                                addressPrefix: [Object],
                                addressPrefixes: [Object],
                                networkSecurityGroup: [Object],
                                routeTable: [Object],
                                natGateway: [Object],
                                serviceEndpoints: [Object],
                                serviceEndpointPolicies: [Object],
                                privateEndpoints: [Object],
                                ipConfigurations: [Object],
                                ipConfigurationProfiles: [Object],
                                ipAllocations: [Object],
                                resourceNavigationLinks: [Object],
                                serviceAssociationLinks: [Object],
                                delegations: [Object],
                                purpose: [Object],
                                provisioningState: [Object],
                                privateEndpointNetworkPolicies: [Object],
                                privateLinkServiceNetworkPolicies: [Object],
                                applicationGatewayIpConfigurations: [Object]
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
                              type: 'string',
                              description: 'Resource type.'
                            }
                          },
                          allOf: [
                            {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            }
                          ],
                          description: 'Subnet in a virtual network resource.'
                        },
                        publicIPAddress: {
                          description: 'The reference to the Public IP resource.',
                          properties: {
                            extendedLocation: {
                              description: 'The extended location of the public ip address.',
                              properties: { name: [Object], type: [Object] }
                            },
                            sku: {
                              description: 'The public IP address SKU.',
                              properties: { name: [Object], tier: [Object] }
                            },
                            properties: {
                              'x-ms-client-flatten': true,
                              description: 'Public IP address properties.',
                              properties: {
                                publicIPAllocationMethod: [Object],
                                publicIPAddressVersion: [Object],
                                ipConfiguration: [Object],
                                dnsSettings: [Object],
                                ddosSettings: [Object],
                                ipTags: [Object],
                                ipAddress: [Object],
                                publicIPPrefix: [Object],
                                idleTimeoutInMinutes: [Object],
                                resourceGuid: [Object],
                                provisioningState: [Object],
                                servicePublicIPAddress: [Object],
                                natGateway: [Object],
                                migrationPhase: [Object],
                                linkedPublicIPAddress: [Object],
                                deleteOption: [Object]
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
                                id: [Object],
                                name: [Object],
                                type: [Object],
                                location: [Object],
                                tags: [Object]
                              },
                              description: 'Common resource representation.',
                              'x-ms-azure-resource': true
                            }
                          ]
                        },
                        publicIPPrefix: {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        },
                        gatewayLoadBalancer: {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        },
                        provisioningState: {
                          readOnly: true,
                          description: 'The provisioning state of the frontend IP configuration resource.',
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
                        }
                      }
                    },
                    name: {
                      type: 'string',
                      description: 'The name of the resource that is unique within the set of frontend IP configurations used by the load balancer. This name can be used to access the resource.'
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
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                destinationPort: {
                  type: 'integer',
                  description: 'The VXLAN destination port that will receive the tapped traffic.'
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
          ]
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the network interface tap configuration resource.',
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
      description: 'Sub Resource type.'
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Tap configuration in a Network Interface.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkInterface.json).
