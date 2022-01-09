---
id: LoadBalancerBackendAddressPool
title: LoadBalancerBackendAddressPool
---
Provides a **LoadBalancerBackendAddressPool** from the **Network** group
## Examples
### Update load balancer backend pool with backend addresses containing virtual network and  IP address.
```js
provider.Network.makeLoadBalancerBackendAddressPool({
  name: "myLoadBalancerBackendAddressPool",
  properties: () => ({
    properties: {
      loadBalancerBackendAddresses: [
        {
          name: "address1",
          properties: {
            virtualNetwork: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb",
            },
            ipAddress: "10.0.0.4",
          },
        },
        {
          name: "address2",
          properties: {
            virtualNetwork: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb",
            },
            ipAddress: "10.0.0.5",
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    subnet: resources.Network.Subnet["mySubnet"],
    networkInterface: resources.Network.NetworkInterface["myNetworkInterface"],
    loadBalancer: resources.Network.LoadBalancer["myLoadBalancer"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [Subnet](../Network/Subnet.md)
- [NetworkInterface](../Network/NetworkInterface.md)
- [LoadBalancer](../Network/LoadBalancer.md)
## Swagger Schema
```js
<ref *3> {
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of load balancer backend address pool.',
      properties: {
        location: {
          type: 'string',
          description: 'The location of the backend address pool.'
        },
        tunnelInterfaces: {
          type: 'array',
          items: {
            properties: {
              port: {
                type: 'integer',
                format: 'int32',
                description: 'Port of gateway load balancer tunnel interface.'
              },
              identifier: {
                type: 'integer',
                format: 'int32',
                description: 'Identifier of gateway load balancer tunnel interface.'
              },
              protocol: {
                type: 'string',
                description: 'Protocol of gateway load balancer tunnel interface.',
                enum: [ 'None', 'Native', 'VXLAN' ],
                'x-ms-enum': {
                  name: 'GatewayLoadBalancerTunnelProtocol',
                  modelAsString: true
                }
              },
              type: {
                type: 'string',
                description: 'Traffic type of gateway load balancer tunnel interface.',
                enum: [ 'None', 'Internal', 'External' ],
                'x-ms-enum': {
                  name: 'GatewayLoadBalancerTunnelInterfaceType',
                  modelAsString: true
                }
              }
            },
            description: 'Gateway load balancer tunnel interface of a load balancer backend address pool.'
          },
          description: 'An array of gateway load balancer tunnel interfaces.'
        },
        loadBalancerBackendAddresses: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer backend address pool.',
                properties: {
                  virtualNetwork: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  subnet: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  ipAddress: {
                    type: 'string',
                    description: 'IP Address belonging to the referenced virtual network.',
                    'x-ms-azure-resource': false
                  },
                  networkInterfaceIPConfiguration: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: true
                  },
                  loadBalancerFrontendIPConfiguration: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: false
                  },
                  inboundNatRulesPortMapping: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        inboundNatRuleName: {
                          type: 'string',
                          description: 'Name of inbound NAT rule.'
                        },
                        frontendPort: {
                          type: 'integer',
                          format: 'int32',
                          description: 'Frontend port.'
                        },
                        backendPort: {
                          type: 'integer',
                          format: 'int32',
                          description: 'Backend port.'
                        }
                      },
                      description: 'Individual port mappings for inbound NAT rule created for backend pool.'
                    },
                    description: 'Collection of inbound NAT rule port mappings.'
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the backend address.'
              }
            },
            description: 'Load balancer backend addresses.'
          },
          description: 'An array of backend addresses.'
        },
        backendIPConfigurations: {
          readOnly: true,
          type: 'array',
          items: <ref *2> {
            properties: <ref *1> {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Network interface IP configuration properties.',
                properties: {
                  gatewayLoadBalancer: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  virtualNetworkTaps: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Virtual Network Tap Properties.',
                          properties: {
                            networkInterfaceTapConfigurations: {
                              readOnly: true,
                              type: 'array',
                              items: {
                                description: 'The reference to the Network Interface.',
                                properties: [Object],
                                allOf: [Array]
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
                            destinationNetworkInterfaceIPConfiguration: {
                              description: 'The reference to the private IP Address of the collector nic that will receive the tap.',
                              properties: [Circular *1],
                              allOf: [ [Object] ]
                            },
                            destinationLoadBalancerFrontEndIPConfiguration: {
                              description: 'The reference to the private IP address on the internal Load Balancer that will receive the tap.',
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object],
                                zones: [Object]
                              },
                              allOf: [ [Object] ]
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
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            },
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
                            location: {
                              type: 'string',
                              description: 'Resource location.'
                            },
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
                          properties: {
                            backendIPConfigurations: {
                              readOnly: true,
                              type: 'array',
                              items: [Circular *2],
                              description: 'Collection of references to IPs defined in network interfaces.'
                            },
                            backendAddresses: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Backend address of an application gateway.'
                              },
                              description: 'Backend addresses.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the backend address pool resource.',
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
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
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
                    items: [Circular *3],
                    description: 'The reference to LoadBalancerBackendAddressPool resource.'
                  },
                  loadBalancerInboundNatRules: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of load balancer inbound NAT rule.',
                          properties: {
                            frontendIPConfiguration: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            backendIPConfiguration: {
                              properties: [Circular *1],
                              allOf: [ [Object] ],
                              description: 'IPConfiguration in a network interface.',
                              readOnly: true
                            },
                            protocol: {
                              description: 'The reference to the transport protocol used by the load balancing rule.',
                              type: 'string',
                              enum: [ 'Udp', 'Tcp', 'All' ],
                              'x-ms-enum': {
                                name: 'TransportProtocol',
                                modelAsString: true
                              }
                            },
                            frontendPort: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The port for the external endpoint. Port numbers for each rule must be unique within the Load Balancer. Acceptable values range from 1 to 65534.'
                            },
                            backendPort: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The port used for the internal endpoint. Acceptable values range from 1 to 65535.'
                            },
                            idleTimeoutInMinutes: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The timeout for the TCP idle connection. The value can be set between 4 and 30 minutes. The default value is 4 minutes. This element is only used when the protocol is set to TCP.'
                            },
                            enableFloatingIP: {
                              type: 'boolean',
                              description: "Configures a virtual machine's endpoint for the floating IP capability required to configure a SQL AlwaysOn Availability Group. This setting is required when using the SQL AlwaysOn Availability Groups in SQL server. This setting can't be changed after you create the endpoint."
                            },
                            enableTcpReset: {
                              type: 'boolean',
                              description: 'Receive bidirectional TCP Reset on TCP flow idle timeout or unexpected connection termination. This element is only used when the protocol is set to TCP.'
                            },
                            frontendPortRangeStart: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The port range start for the external endpoint. This property is used together with BackendAddressPool and FrontendPortRangeEnd. Individual inbound NAT rule port mappings will be created for each backend address from BackendAddressPool. Acceptable values range from 1 to 65534.'
                            },
                            frontendPortRangeEnd: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The port range end for the external endpoint. This property is used together with BackendAddressPool and FrontendPortRangeStart. Individual inbound NAT rule port mappings will be created for each backend address from BackendAddressPool. Acceptable values range from 1 to 65534.'
                            },
                            backendAddressPool: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the inbound NAT rule resource.',
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
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
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
                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                  },
                  privateIPAddressVersion: {
                    description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                    type: 'string',
                    enum: [ 'IPv4', 'IPv6' ],
                    'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                  },
                  subnet: {
                    description: 'Subnet bound to the IP configuration.',
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
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
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
                  primary: {
                    type: 'boolean',
                    description: 'Whether this is a primary customer address on the network interface.'
                  },
                  publicIPAddress: {
                    description: 'Public IP address bound to the IP configuration.',
                    properties: <ref *4> {
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
                            'x-ms-enum': {
                              name: 'IPAllocationMethod',
                              modelAsString: true
                            }
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
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
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
                          servicePublicIPAddress: {
                            description: 'The service public IP address of the public IP address resource.',
                            properties: [Circular *4],
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
                            enum: [
                              'None',
                              'Prepare',
                              'Commit',
                              'Abort',
                              'Committed'
                            ],
                            'x-ms-enum': {
                              name: 'PublicIPAddressMigrationPhase',
                              modelAsString: true
                            }
                          },
                          linkedPublicIPAddress: {
                            description: 'The linked public IP address of the public IP address resource.',
                            properties: [Circular *4],
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
                            'x-ms-enum': {
                              name: 'DeleteOptions',
                              modelAsString: true
                            }
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
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          },
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
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
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
                  applicationSecurityGroups: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application security group.',
                          properties: {
                            resourceGuid: {
                              readOnly: true,
                              type: 'string',
                              description: 'The resource GUID property of the application security group resource. It uniquely identifies a resource, even if the user changes its name or migrate the resource across subscriptions or resource groups.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the application security group resource.',
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
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            },
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
                            location: {
                              type: 'string',
                              description: 'Resource location.'
                            },
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
                      description: 'An application security group in a resource group.'
                    },
                    description: 'Application security groups in which the IP configuration is included.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the network interface IP configuration.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'IPConfiguration in a network interface.'
          },
          description: 'An array of references to IP addresses defined in network interfaces.'
        },
        loadBalancingRules: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'An array of references to load balancing rules that use this backend address pool.'
        },
        outboundRule: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true,
          readOnly: true
        },
        outboundRules: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'An array of references to outbound rules that use this backend address pool.'
        },
        inboundNatRules: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'An array of references to inbound NAT rules that use this backend address pool.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the backend address pool resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
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
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Pool of backend IP addresses.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/loadBalancer.json).
