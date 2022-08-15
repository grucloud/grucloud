---
id: NetworkInterfaceTapConfiguration
title: NetworkInterfaceTapConfiguration
---
Provides a **NetworkInterfaceTapConfiguration** from the **Network** group
## Examples
### Create Network Interface Tap Configurations
```js
exports.createResources = () => [
  {
    type: "NetworkInterfaceTapConfiguration",
    group: "Network",
    name: "myNetworkInterfaceTapConfiguration",
    properties: () => ({
      properties: {
        virtualNetworkTap: {
          id: "/subscriptions/subid/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworkTaps/testvtap",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualNetworkTap: "myVirtualNetworkTap",
      networkInterface: "myNetworkInterface",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetworkTap](../Network/VirtualNetworkTap.md)
- [NetworkInterface](../Network/NetworkInterface.md)
## Swagger Schema
```json
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
                  properties: <ref *3> {
                    properties: {
                      'x-ms-client-flatten': true,
                      description: 'Network interface IP configuration properties.',
                      properties: {
                        gatewayLoadBalancer: {
                          description: 'The reference to gateway load balancer frontend IP.',
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          'x-ms-azure-resource': true
                        },
                        virtualNetworkTaps: {
                          type: 'array',
                          items: {
                            properties: [Circular *2],
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
                                    items: {
                                      properties: [Circular *3],
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
                                      description: 'IPConfiguration in a network interface.'
                                    },
                                    description: 'Collection of references to IPs defined in network interfaces.'
                                  },
                                  backendAddresses: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        fqdn: {
                                          type: 'string',
                                          description: 'Fully qualified domain name (FQDN).'
                                        },
                                        ipAddress: {
                                          type: 'string',
                                          description: 'IP address.'
                                        }
                                      },
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
                          items: {
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
                                          enum: [
                                            'None',
                                            'Internal',
                                            'External'
                                          ],
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
                                              description: 'Reference to an existing virtual network.',
                                              properties: {
                                                id: {
                                                  type: 'string',
                                                  description: 'Resource ID.'
                                                }
                                              },
                                              'x-ms-azure-resource': true
                                            },
                                            subnet: {
                                              description: 'Reference to an existing subnet.',
                                              properties: {
                                                id: {
                                                  type: 'string',
                                                  description: 'Resource ID.'
                                                }
                                              },
                                              'x-ms-azure-resource': true
                                            },
                                            ipAddress: {
                                              type: 'string',
                                              description: 'IP Address belonging to the referenced virtual network.',
                                              'x-ms-azure-resource': false
                                            },
                                            networkInterfaceIPConfiguration: {
                                              readOnly: true,
                                              description: 'Reference to IP address defined in network interfaces.',
                                              properties: {
                                                id: {
                                                  type: 'string',
                                                  description: 'Resource ID.'
                                                }
                                              },
                                              'x-ms-azure-resource': true
                                            },
                                            loadBalancerFrontendIPConfiguration: {
                                              readOnly: false,
                                              description: 'Reference to the frontend ip address configuration defined in regional loadbalancer.',
                                              properties: {
                                                id: {
                                                  type: 'string',
                                                  description: 'Resource ID.'
                                                }
                                              },
                                              'x-ms-azure-resource': true
                                            },
                                            inboundNatRulesPortMapping: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                type: 'object',
                                                properties: {
                                                  inboundNatRuleName: [Object],
                                                  frontendPort: [Object],
                                                  backendPort: [Object]
                                                },
                                                description: 'Individual port mappings for inbound NAT rule created for backend pool.'
                                              },
                                              description: 'Collection of inbound NAT rule port mappings.'
                                            },
                                            adminState: {
                                              type: 'string',
                                              description: 'A list of administrative states which once set can override health probe so that Load Balancer will always forward new connections to backend, or deny new connections and reset existing connections.',
                                              enum: [
                                                'None',
                                                'Up',
                                                'Down',
                                                'Drain'
                                              ],
                                              'x-ms-enum': {
                                                name: 'LoadBalancerBackendAddressAdminState',
                                                modelAsString: true
                                              }
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
                                    items: {
                                      properties: [Circular *3],
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
                                      description: 'IPConfiguration in a network interface.'
                                    },
                                    description: 'An array of references to IP addresses defined in network interfaces.'
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
                                    description: 'An array of references to load balancing rules that use this backend address pool.'
                                  },
                                  outboundRule: {
                                    readOnly: true,
                                    description: 'A reference to an outbound rule that uses this backend address pool.',
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      }
                                    },
                                    'x-ms-azure-resource': true
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
                                    description: 'An array of references to outbound rules that use this backend address pool.'
                                  },
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
                                    description: 'An array of references to inbound NAT rules that use this backend address pool.'
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
                                  },
                                  drainPeriodInSeconds: {
                                    type: 'integer',
                                    format: 'int32',
                                    description: 'Amount of seconds Load Balancer waits for before sending RESET to client and backend address.'
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
                                properties: {
                                  frontendIPConfiguration: {
                                    description: 'A reference to frontend IP addresses.',
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      }
                                    },
                                    'x-ms-azure-resource': true
                                  },
                                  backendIPConfiguration: {
                                    readOnly: true,
                                    description: 'A reference to a private IP address defined on a network interface of a VM. Traffic sent to the frontend port of each of the frontend IP configurations is forwarded to the backend IP.',
                                    properties: [Circular *3],
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
                                    description: 'A reference to backendAddressPool resource.',
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      }
                                    },
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
                          description: 'Subnet bound to the IP configuration.',
                          properties: <ref *4> {
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
                                      properties: {
                                        flushConnection: {
                                          type: 'boolean',
                                          description: 'When enabled, flows created from Network Security Group connections will be re-evaluated when rules are updates. Initial enablement will trigger re-evaluation.'
                                        },
                                        securityRules: {
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the security rule.',
                                                properties: {
                                                  description: [Object],
                                                  protocol: [Object],
                                                  sourcePortRange: [Object],
                                                  destinationPortRange: [Object],
                                                  sourceAddressPrefix: [Object],
                                                  sourceAddressPrefixes: [Object],
                                                  sourceApplicationSecurityGroups: [Object],
                                                  destinationAddressPrefix: [Object],
                                                  destinationAddressPrefixes: [Object],
                                                  destinationApplicationSecurityGroups: [Object],
                                                  sourcePortRanges: [Object],
                                                  destinationPortRanges: [Object],
                                                  access: [Object],
                                                  priority: [Object],
                                                  direction: [Object],
                                                  provisioningState: [Object]
                                                },
                                                required: [
                                                  'protocol',
                                                  'access',
                                                  'direction'
                                                ]
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
                                                description: 'The type of the resource.'
                                              }
                                            },
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Network security rule.'
                                          },
                                          description: 'A collection of security rules of the network security group.'
                                        },
                                        defaultSecurityRules: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the security rule.',
                                                properties: {
                                                  description: [Object],
                                                  protocol: [Object],
                                                  sourcePortRange: [Object],
                                                  destinationPortRange: [Object],
                                                  sourceAddressPrefix: [Object],
                                                  sourceAddressPrefixes: [Object],
                                                  sourceApplicationSecurityGroups: [Object],
                                                  destinationAddressPrefix: [Object],
                                                  destinationAddressPrefixes: [Object],
                                                  destinationApplicationSecurityGroups: [Object],
                                                  sourcePortRanges: [Object],
                                                  destinationPortRanges: [Object],
                                                  access: [Object],
                                                  priority: [Object],
                                                  direction: [Object],
                                                  provisioningState: [Object]
                                                },
                                                required: [
                                                  'protocol',
                                                  'access',
                                                  'direction'
                                                ]
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
                                                description: 'The type of the resource.'
                                              }
                                            },
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Network security rule.'
                                          },
                                          description: 'The default security rules of network security group.'
                                        },
                                        networkInterfaces: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: {
                                              extendedLocation: {
                                                description: 'The extended location of the network interface.',
                                                properties: {
                                                  name: [Object],
                                                  type: [Object]
                                                }
                                              },
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the network interface.',
                                                properties: {
                                                  virtualMachine: [Object],
                                                  networkSecurityGroup: [Object],
                                                  privateEndpoint: [Object],
                                                  ipConfigurations: [Object],
                                                  tapConfigurations: [Object],
                                                  dnsSettings: [Object],
                                                  macAddress: [Object],
                                                  primary: [Object],
                                                  vnetEncryptionSupported: [Object],
                                                  enableAcceleratedNetworking: [Object],
                                                  enableIPForwarding: [Object],
                                                  hostedWorkloads: [Object],
                                                  dscpConfiguration: [Object],
                                                  resourceGuid: [Object],
                                                  provisioningState: [Object],
                                                  workloadType: [Object],
                                                  nicType: [Object],
                                                  privateLinkService: [Object],
                                                  migrationPhase: [Object],
                                                  auxiliaryMode: [Object]
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
                                                  id: [Object],
                                                  name: [Object],
                                                  type: [Object],
                                                  location: [Object],
                                                  tags: [Object]
                                                },
                                                description: 'Common resource representation.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'A network interface in a resource group.'
                                          },
                                          description: 'A collection of references to network interfaces.'
                                        },
                                        subnets: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Subnet in a virtual network resource.'
                                          },
                                          description: 'A collection of references to subnets.'
                                        },
                                        flowLogs: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the flow log.',
                                                required: [
                                                  'targetResourceId',
                                                  'storageId'
                                                ],
                                                properties: {
                                                  targetResourceId: [Object],
                                                  targetResourceGuid: [Object],
                                                  storageId: [Object],
                                                  enabled: [Object],
                                                  retentionPolicy: [Object],
                                                  format: [Object],
                                                  flowAnalyticsConfiguration: [Object],
                                                  provisioningState: [Object]
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
                                                  id: [Object],
                                                  name: [Object],
                                                  type: [Object],
                                                  location: [Object],
                                                  tags: [Object]
                                                },
                                                description: 'Common resource representation.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'A flow log resource.'
                                          },
                                          description: 'A collection of references to flow log resources.'
                                        },
                                        resourceGuid: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'The resource GUID property of the network security group resource.'
                                        },
                                        provisioningState: {
                                          readOnly: true,
                                          description: 'The provisioning state of the network security group resource.',
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
                                  ]
                                },
                                routeTable: {
                                  description: 'The reference to the RouteTable resource.',
                                  properties: {
                                    properties: {
                                      'x-ms-client-flatten': true,
                                      description: 'Properties of the route table.',
                                      properties: {
                                        routes: {
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the route.',
                                                properties: {
                                                  addressPrefix: [Object],
                                                  nextHopType: [Object],
                                                  nextHopIpAddress: [Object],
                                                  provisioningState: [Object],
                                                  hasBgpOverride: [Object]
                                                },
                                                required: [ 'nextHopType' ]
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
                                                description: 'The type of the resource.'
                                              }
                                            },
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Route resource.'
                                          },
                                          description: 'Collection of routes contained within a route table.'
                                        },
                                        subnets: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Subnet in a virtual network resource.'
                                          },
                                          description: 'A collection of references to subnets.'
                                        },
                                        disableBgpRoutePropagation: {
                                          type: 'boolean',
                                          description: 'Whether to disable the routes learned by BGP on that route table. True means disable.'
                                        },
                                        provisioningState: {
                                          readOnly: true,
                                          description: 'The provisioning state of the route table resource.',
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
                                        resourceGuid: {
                                          type: 'string',
                                          readOnly: true,
                                          description: 'The resource GUID property of the route table.'
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
                                  ]
                                },
                                natGateway: {
                                  description: 'Nat gateway associated with this subnet.',
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
                                  'x-ms-azure-resource': true
                                },
                                serviceEndpoints: {
                                  type: 'array',
                                  items: {
                                    properties: {
                                      service: {
                                        type: 'string',
                                        description: 'The type of the endpoint service.'
                                      },
                                      locations: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'A list of locations.'
                                      },
                                      provisioningState: {
                                        readOnly: true,
                                        description: 'The provisioning state of the service endpoint resource.',
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
                                    },
                                    description: 'The service endpoint properties.'
                                  },
                                  description: 'An array of service endpoints.'
                                },
                                serviceEndpointPolicies: {
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the service end point policy.',
                                        properties: {
                                          serviceEndpointPolicyDefinitions: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the service endpoint policy definition.',
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
                                                type: {
                                                  type: 'string',
                                                  description: 'The type of the resource.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Service Endpoint policy definitions.'
                                            },
                                            description: 'A collection of service endpoint policy definitions of the service endpoint policy.'
                                          },
                                          subnets: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: [Circular *4],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Subnet in a virtual network resource.'
                                            },
                                            description: 'A collection of references to subnets.'
                                          },
                                          resourceGuid: {
                                            type: 'string',
                                            readOnly: true,
                                            description: 'The resource GUID property of the service endpoint policy resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service endpoint policy resource.',
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
                                          serviceAlias: {
                                            type: 'string',
                                            description: 'The alias indicating if the policy belongs to a service'
                                          },
                                          contextualServiceEndpointPolicies: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'A collection of contextual service endpoint policy.'
                                          }
                                        }
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      },
                                      kind: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Kind of service endpoint policy. This is metadata used for the Azure portal experience.'
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
                                    description: 'Service End point policy resource.'
                                  },
                                  description: 'An array of service endpoint policies.'
                                },
                                privateEndpoints: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
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
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
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
                                                extendedLocation: {
                                                  description: 'The extended location of the network interface.',
                                                  properties: [Object]
                                                },
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the network interface.',
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
                                              description: 'A network interface in a resource group.'
                                            },
                                            description: 'An array of references to the network interfaces created for this private endpoint.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the private endpoint resource.',
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
                                          privateLinkServiceConnections: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the private link service connection.',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                type: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'The resource type.'
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
                                              ],
                                              description: 'PrivateLinkServiceConnection resource.'
                                            },
                                            description: 'A grouping of information about the connection to the remote resource.'
                                          },
                                          manualPrivateLinkServiceConnections: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the private link service connection.',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                type: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'The resource type.'
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
                                              ],
                                              description: 'PrivateLinkServiceConnection resource.'
                                            },
                                            description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                                          },
                                          customDnsConfigs: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                fqdn: {
                                                  type: 'string',
                                                  description: 'Fqdn that resolves to private endpoint ip address.'
                                                },
                                                ipAddresses: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'A list of private ip addresses of the private endpoint.'
                                                }
                                              },
                                              description: 'Contains custom Dns resolution configuration from customer.'
                                            },
                                            description: 'An array of custom dns configurations.'
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
                                            description: 'Application security groups in which the private endpoint IP configuration is included.'
                                          },
                                          ipConfigurations: {
                                            type: 'array',
                                            items: {
                                              type: 'object',
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of private endpoint IP configurations.',
                                                  type: 'object',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group.'
                                                },
                                                type: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'The resource type.'
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                }
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
                                    description: 'Private endpoint resource.'
                                  },
                                  description: 'An array of references to private endpoints.'
                                },
                                ipConfigurations: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the IP configuration.',
                                        properties: {
                                          privateIPAddress: {
                                            type: 'string',
                                            description: 'The private IP address of the IP configuration.'
                                          },
                                          privateIPAllocationMethod: {
                                            description: 'The private IP address allocation method.',
                                            default: 'Dynamic',
                                            type: 'string',
                                            enum: [ 'Static', 'Dynamic' ],
                                            'x-ms-enum': {
                                              name: 'IPAllocationMethod',
                                              modelAsString: true
                                            }
                                          },
                                          subnet: {
                                            description: 'The reference to the subnet resource.',
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ]
                                          },
                                          publicIPAddress: {
                                            description: 'The reference to the public IP resource.',
                                            properties: {
                                              extendedLocation: {
                                                description: 'The extended location of the public ip address.',
                                                properties: {
                                                  name: [Object],
                                                  type: [Object]
                                                }
                                              },
                                              sku: {
                                                description: 'The public IP address SKU.',
                                                properties: {
                                                  name: [Object],
                                                  tier: [Object]
                                                }
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
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the IP configuration resource.',
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
                                    description: 'IP configuration.'
                                  },
                                  description: 'An array of references to the network interface IP configurations using subnet.'
                                },
                                ipConfigurationProfiles: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the IP configuration profile.',
                                        properties: {
                                          subnet: {
                                            description: 'The reference to the subnet resource to create a container network interface ip configuration.',
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ]
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the IP configuration profile resource.',
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
                                        description: 'The name of the resource. This name can be used to access the resource.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Sub Resource type.'
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
                                          }
                                        },
                                        description: 'Reference to another subresource.',
                                        'x-ms-azure-resource': true
                                      }
                                    ],
                                    description: 'IP configuration profile child resource.'
                                  },
                                  description: 'Array of IP configuration profiles which reference this subnet.'
                                },
                                ipAllocations: {
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
                                  description: 'Array of IpAllocation which reference this subnet.'
                                },
                                resourceNavigationLinks: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Resource navigation link properties format.',
                                        properties: {
                                          linkedResourceType: {
                                            type: 'string',
                                            description: 'Resource type of the linked resource.'
                                          },
                                          link: {
                                            type: 'string',
                                            description: 'Link to the external resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the resource navigation link resource.',
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
                                        description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                      },
                                      id: {
                                        type: 'string',
                                        readOnly: true,
                                        description: 'Resource navigation link identifier.'
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource type.'
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
                                    description: 'ResourceNavigationLink resource.'
                                  },
                                  description: 'An array of references to the external resources using subnet.'
                                },
                                serviceAssociationLinks: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Resource navigation link properties format.',
                                        properties: {
                                          linkedResourceType: {
                                            type: 'string',
                                            description: 'Resource type of the linked resource.'
                                          },
                                          link: {
                                            type: 'string',
                                            description: 'Link to the external resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service association link resource.',
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
                                          allowDelete: {
                                            type: 'boolean',
                                            description: 'If true, the resource can be deleted.'
                                          },
                                          locations: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'A list of locations.'
                                          }
                                        }
                                      },
                                      name: {
                                        type: 'string',
                                        description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource type.'
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
                                    description: 'ServiceAssociationLink resource.'
                                  },
                                  description: 'An array of references to services injecting into this subnet.'
                                },
                                delegations: {
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the subnet.',
                                        properties: {
                                          serviceName: {
                                            type: 'string',
                                            description: 'The name of the service to whom the subnet should be delegated (e.g. Microsoft.Sql/servers).'
                                          },
                                          actions: {
                                            readOnly: true,
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The actions permitted to the service upon delegation.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service delegation resource.',
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
                                        description: 'The name of the resource that is unique within a subnet. This name can be used to access the resource.'
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
                                  default: 'Disabled',
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
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the application gateway IP configuration.',
                                        properties: {
                                          subnet: {
                                            description: 'Reference to the subnet resource. A subnet from where application gateway gets its private address.',
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            'x-ms-azure-resource': true
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the application gateway IP configuration resource.',
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
                                        description: 'Name of the IP configuration that is unique within an Application Gateway.'
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
                            type: {
                              type: 'string',
                              description: 'Resource type.'
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
                          ]
                        },
                        primary: {
                          type: 'boolean',
                          description: 'Whether this is a primary customer address on the network interface.'
                        },
                        publicIPAddress: {
                          description: 'Public IP address bound to the IP configuration.',
                          properties: <ref *5> {
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
                                  'x-ms-enum': {
                                    name: 'IPVersion',
                                    modelAsString: true
                                  }
                                },
                                ipConfiguration: {
                                  readOnly: true,
                                  description: 'The IP configuration associated with the public IP address.',
                                  properties: {
                                    properties: {
                                      'x-ms-client-flatten': true,
                                      description: 'Properties of the IP configuration.',
                                      properties: {
                                        privateIPAddress: {
                                          type: 'string',
                                          description: 'The private IP address of the IP configuration.'
                                        },
                                        privateIPAllocationMethod: {
                                          description: 'The private IP address allocation method.',
                                          default: 'Dynamic',
                                          type: 'string',
                                          enum: [ 'Static', 'Dynamic' ],
                                          'x-ms-enum': {
                                            name: 'IPAllocationMethod',
                                            modelAsString: true
                                          }
                                        },
                                        subnet: {
                                          description: 'The reference to the subnet resource.',
                                          properties: <ref *4> {
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
                                                  items: [Object],
                                                  description: 'List of address prefixes for the subnet.'
                                                },
                                                networkSecurityGroup: {
                                                  description: 'The reference to the NetworkSecurityGroup resource.',
                                                  properties: [Object],
                                                  allOf: [Array]
                                                },
                                                routeTable: {
                                                  description: 'The reference to the RouteTable resource.',
                                                  properties: [Object],
                                                  allOf: [Array]
                                                },
                                                natGateway: {
                                                  description: 'Nat gateway associated with this subnet.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
                                                },
                                                serviceEndpoints: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of service endpoints.'
                                                },
                                                serviceEndpointPolicies: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of service endpoint policies.'
                                                },
                                                privateEndpoints: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to private endpoints.'
                                                },
                                                ipConfigurations: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to the network interface IP configurations using subnet.'
                                                },
                                                ipConfigurationProfiles: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'Array of IP configuration profiles which reference this subnet.'
                                                },
                                                ipAllocations: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'Array of IpAllocation which reference this subnet.'
                                                },
                                                resourceNavigationLinks: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to the external resources using subnet.'
                                                },
                                                serviceAssociationLinks: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to services injecting into this subnet.'
                                                },
                                                delegations: {
                                                  type: 'array',
                                                  items: [Object],
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
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                privateEndpointNetworkPolicies: {
                                                  type: 'string',
                                                  default: 'Disabled',
                                                  description: 'Enable or Disable apply network policies on private end point in the subnet.',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                privateLinkServiceNetworkPolicies: {
                                                  type: 'string',
                                                  default: 'Enabled',
                                                  description: 'Enable or Disable apply network policies on private link service in the subnet.',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                applicationGatewayIpConfigurations: {
                                                  type: 'array',
                                                  items: [Object],
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
                                            type: {
                                              type: 'string',
                                              description: 'Resource type.'
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
                                          ]
                                        },
                                        publicIPAddress: {
                                          description: 'The reference to the public IP resource.',
                                          properties: [Circular *5],
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
                                                  additionalProperties: [Object],
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
                                      readOnly: false,
                                      description: 'The DDoS custom policy associated with the public IP.',
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      'x-ms-azure-resource': true
                                    },
                                    protectionCoverage: {
                                      readOnly: false,
                                      type: 'string',
                                      enum: [ 'Basic', 'Standard' ],
                                      'x-ms-enum': {
                                        name: 'DdosSettingsProtectionCoverage',
                                        modelAsString: true
                                      },
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
                                  description: 'The list of tags associated with the public IP address.'
                                },
                                ipAddress: {
                                  type: 'string',
                                  description: 'The IP address associated with the public IP address resource.'
                                },
                                publicIPPrefix: {
                                  description: 'The Public IP Prefix this Public IP Address should be allocated from.',
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
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
                                  properties: [Circular *5],
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
                                natGateway: {
                                  description: 'The NatGateway for the Public IP address.',
                                  properties: {
                                    sku: {
                                      description: 'The nat gateway SKU.',
                                      properties: {
                                        name: {
                                          type: 'string',
                                          description: 'Name of Nat Gateway SKU.',
                                          enum: [ 'Standard' ],
                                          'x-ms-enum': {
                                            name: 'NatGatewaySkuName',
                                            modelAsString: true
                                          }
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                  properties: [Circular *5],
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
                          description: 'The reference to the subnet resource.',
                          properties: <ref *4> {
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
                                      properties: {
                                        flushConnection: {
                                          type: 'boolean',
                                          description: 'When enabled, flows created from Network Security Group connections will be re-evaluated when rules are updates. Initial enablement will trigger re-evaluation.'
                                        },
                                        securityRules: {
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the security rule.',
                                                properties: {
                                                  description: [Object],
                                                  protocol: [Object],
                                                  sourcePortRange: [Object],
                                                  destinationPortRange: [Object],
                                                  sourceAddressPrefix: [Object],
                                                  sourceAddressPrefixes: [Object],
                                                  sourceApplicationSecurityGroups: [Object],
                                                  destinationAddressPrefix: [Object],
                                                  destinationAddressPrefixes: [Object],
                                                  destinationApplicationSecurityGroups: [Object],
                                                  sourcePortRanges: [Object],
                                                  destinationPortRanges: [Object],
                                                  access: [Object],
                                                  priority: [Object],
                                                  direction: [Object],
                                                  provisioningState: [Object]
                                                },
                                                required: [
                                                  'protocol',
                                                  'access',
                                                  'direction'
                                                ]
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
                                                description: 'The type of the resource.'
                                              }
                                            },
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Network security rule.'
                                          },
                                          description: 'A collection of security rules of the network security group.'
                                        },
                                        defaultSecurityRules: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the security rule.',
                                                properties: {
                                                  description: [Object],
                                                  protocol: [Object],
                                                  sourcePortRange: [Object],
                                                  destinationPortRange: [Object],
                                                  sourceAddressPrefix: [Object],
                                                  sourceAddressPrefixes: [Object],
                                                  sourceApplicationSecurityGroups: [Object],
                                                  destinationAddressPrefix: [Object],
                                                  destinationAddressPrefixes: [Object],
                                                  destinationApplicationSecurityGroups: [Object],
                                                  sourcePortRanges: [Object],
                                                  destinationPortRanges: [Object],
                                                  access: [Object],
                                                  priority: [Object],
                                                  direction: [Object],
                                                  provisioningState: [Object]
                                                },
                                                required: [
                                                  'protocol',
                                                  'access',
                                                  'direction'
                                                ]
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
                                                description: 'The type of the resource.'
                                              }
                                            },
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Network security rule.'
                                          },
                                          description: 'The default security rules of network security group.'
                                        },
                                        networkInterfaces: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: {
                                              extendedLocation: {
                                                description: 'The extended location of the network interface.',
                                                properties: {
                                                  name: [Object],
                                                  type: [Object]
                                                }
                                              },
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the network interface.',
                                                properties: {
                                                  virtualMachine: [Object],
                                                  networkSecurityGroup: [Object],
                                                  privateEndpoint: [Object],
                                                  ipConfigurations: [Object],
                                                  tapConfigurations: [Object],
                                                  dnsSettings: [Object],
                                                  macAddress: [Object],
                                                  primary: [Object],
                                                  vnetEncryptionSupported: [Object],
                                                  enableAcceleratedNetworking: [Object],
                                                  enableIPForwarding: [Object],
                                                  hostedWorkloads: [Object],
                                                  dscpConfiguration: [Object],
                                                  resourceGuid: [Object],
                                                  provisioningState: [Object],
                                                  workloadType: [Object],
                                                  nicType: [Object],
                                                  privateLinkService: [Object],
                                                  migrationPhase: [Object],
                                                  auxiliaryMode: [Object]
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
                                                  id: [Object],
                                                  name: [Object],
                                                  type: [Object],
                                                  location: [Object],
                                                  tags: [Object]
                                                },
                                                description: 'Common resource representation.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'A network interface in a resource group.'
                                          },
                                          description: 'A collection of references to network interfaces.'
                                        },
                                        subnets: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Subnet in a virtual network resource.'
                                          },
                                          description: 'A collection of references to subnets.'
                                        },
                                        flowLogs: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the flow log.',
                                                required: [
                                                  'targetResourceId',
                                                  'storageId'
                                                ],
                                                properties: {
                                                  targetResourceId: [Object],
                                                  targetResourceGuid: [Object],
                                                  storageId: [Object],
                                                  enabled: [Object],
                                                  retentionPolicy: [Object],
                                                  format: [Object],
                                                  flowAnalyticsConfiguration: [Object],
                                                  provisioningState: [Object]
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
                                                  id: [Object],
                                                  name: [Object],
                                                  type: [Object],
                                                  location: [Object],
                                                  tags: [Object]
                                                },
                                                description: 'Common resource representation.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'A flow log resource.'
                                          },
                                          description: 'A collection of references to flow log resources.'
                                        },
                                        resourceGuid: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'The resource GUID property of the network security group resource.'
                                        },
                                        provisioningState: {
                                          readOnly: true,
                                          description: 'The provisioning state of the network security group resource.',
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
                                  ]
                                },
                                routeTable: {
                                  description: 'The reference to the RouteTable resource.',
                                  properties: {
                                    properties: {
                                      'x-ms-client-flatten': true,
                                      description: 'Properties of the route table.',
                                      properties: {
                                        routes: {
                                          type: 'array',
                                          items: {
                                            properties: {
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the route.',
                                                properties: {
                                                  addressPrefix: [Object],
                                                  nextHopType: [Object],
                                                  nextHopIpAddress: [Object],
                                                  provisioningState: [Object],
                                                  hasBgpOverride: [Object]
                                                },
                                                required: [ 'nextHopType' ]
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
                                                description: 'The type of the resource.'
                                              }
                                            },
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Route resource.'
                                          },
                                          description: 'Collection of routes contained within a route table.'
                                        },
                                        subnets: {
                                          readOnly: true,
                                          type: 'array',
                                          items: {
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ],
                                            description: 'Subnet in a virtual network resource.'
                                          },
                                          description: 'A collection of references to subnets.'
                                        },
                                        disableBgpRoutePropagation: {
                                          type: 'boolean',
                                          description: 'Whether to disable the routes learned by BGP on that route table. True means disable.'
                                        },
                                        provisioningState: {
                                          readOnly: true,
                                          description: 'The provisioning state of the route table resource.',
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
                                        resourceGuid: {
                                          type: 'string',
                                          readOnly: true,
                                          description: 'The resource GUID property of the route table.'
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
                                  ]
                                },
                                natGateway: {
                                  description: 'Nat gateway associated with this subnet.',
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
                                  'x-ms-azure-resource': true
                                },
                                serviceEndpoints: {
                                  type: 'array',
                                  items: {
                                    properties: {
                                      service: {
                                        type: 'string',
                                        description: 'The type of the endpoint service.'
                                      },
                                      locations: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'A list of locations.'
                                      },
                                      provisioningState: {
                                        readOnly: true,
                                        description: 'The provisioning state of the service endpoint resource.',
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
                                    },
                                    description: 'The service endpoint properties.'
                                  },
                                  description: 'An array of service endpoints.'
                                },
                                serviceEndpointPolicies: {
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the service end point policy.',
                                        properties: {
                                          serviceEndpointPolicyDefinitions: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the service endpoint policy definition.',
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
                                                type: {
                                                  type: 'string',
                                                  description: 'The type of the resource.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Service Endpoint policy definitions.'
                                            },
                                            description: 'A collection of service endpoint policy definitions of the service endpoint policy.'
                                          },
                                          subnets: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: [Circular *4],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Subnet in a virtual network resource.'
                                            },
                                            description: 'A collection of references to subnets.'
                                          },
                                          resourceGuid: {
                                            type: 'string',
                                            readOnly: true,
                                            description: 'The resource GUID property of the service endpoint policy resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service endpoint policy resource.',
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
                                          serviceAlias: {
                                            type: 'string',
                                            description: 'The alias indicating if the policy belongs to a service'
                                          },
                                          contextualServiceEndpointPolicies: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'A collection of contextual service endpoint policy.'
                                          }
                                        }
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      },
                                      kind: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Kind of service endpoint policy. This is metadata used for the Azure portal experience.'
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
                                    description: 'Service End point policy resource.'
                                  },
                                  description: 'An array of service endpoint policies.'
                                },
                                privateEndpoints: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
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
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
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
                                                extendedLocation: {
                                                  description: 'The extended location of the network interface.',
                                                  properties: [Object]
                                                },
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the network interface.',
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
                                              description: 'A network interface in a resource group.'
                                            },
                                            description: 'An array of references to the network interfaces created for this private endpoint.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the private endpoint resource.',
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
                                          privateLinkServiceConnections: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the private link service connection.',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                type: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'The resource type.'
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
                                              ],
                                              description: 'PrivateLinkServiceConnection resource.'
                                            },
                                            description: 'A grouping of information about the connection to the remote resource.'
                                          },
                                          manualPrivateLinkServiceConnections: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the private link service connection.',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                type: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'The resource type.'
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
                                              ],
                                              description: 'PrivateLinkServiceConnection resource.'
                                            },
                                            description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                                          },
                                          customDnsConfigs: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                fqdn: {
                                                  type: 'string',
                                                  description: 'Fqdn that resolves to private endpoint ip address.'
                                                },
                                                ipAddresses: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'A list of private ip addresses of the private endpoint.'
                                                }
                                              },
                                              description: 'Contains custom Dns resolution configuration from customer.'
                                            },
                                            description: 'An array of custom dns configurations.'
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
                                            description: 'Application security groups in which the private endpoint IP configuration is included.'
                                          },
                                          ipConfigurations: {
                                            type: 'array',
                                            items: {
                                              type: 'object',
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of private endpoint IP configurations.',
                                                  type: 'object',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group.'
                                                },
                                                type: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'The resource type.'
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                }
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
                                    description: 'Private endpoint resource.'
                                  },
                                  description: 'An array of references to private endpoints.'
                                },
                                ipConfigurations: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the IP configuration.',
                                        properties: {
                                          privateIPAddress: {
                                            type: 'string',
                                            description: 'The private IP address of the IP configuration.'
                                          },
                                          privateIPAllocationMethod: {
                                            description: 'The private IP address allocation method.',
                                            default: 'Dynamic',
                                            type: 'string',
                                            enum: [ 'Static', 'Dynamic' ],
                                            'x-ms-enum': {
                                              name: 'IPAllocationMethod',
                                              modelAsString: true
                                            }
                                          },
                                          subnet: {
                                            description: 'The reference to the subnet resource.',
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ]
                                          },
                                          publicIPAddress: {
                                            description: 'The reference to the public IP resource.',
                                            properties: <ref *5> {
                                              extendedLocation: {
                                                description: 'The extended location of the public ip address.',
                                                properties: {
                                                  name: [Object],
                                                  type: [Object]
                                                }
                                              },
                                              sku: {
                                                description: 'The public IP address SKU.',
                                                properties: {
                                                  name: [Object],
                                                  tier: [Object]
                                                }
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
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the IP configuration resource.',
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
                                    description: 'IP configuration.'
                                  },
                                  description: 'An array of references to the network interface IP configurations using subnet.'
                                },
                                ipConfigurationProfiles: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the IP configuration profile.',
                                        properties: {
                                          subnet: {
                                            description: 'The reference to the subnet resource to create a container network interface ip configuration.',
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              }
                                            ]
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the IP configuration profile resource.',
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
                                        description: 'The name of the resource. This name can be used to access the resource.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Sub Resource type.'
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
                                          }
                                        },
                                        description: 'Reference to another subresource.',
                                        'x-ms-azure-resource': true
                                      }
                                    ],
                                    description: 'IP configuration profile child resource.'
                                  },
                                  description: 'Array of IP configuration profiles which reference this subnet.'
                                },
                                ipAllocations: {
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
                                  description: 'Array of IpAllocation which reference this subnet.'
                                },
                                resourceNavigationLinks: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Resource navigation link properties format.',
                                        properties: {
                                          linkedResourceType: {
                                            type: 'string',
                                            description: 'Resource type of the linked resource.'
                                          },
                                          link: {
                                            type: 'string',
                                            description: 'Link to the external resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the resource navigation link resource.',
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
                                        description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                      },
                                      id: {
                                        type: 'string',
                                        readOnly: true,
                                        description: 'Resource navigation link identifier.'
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource type.'
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
                                    description: 'ResourceNavigationLink resource.'
                                  },
                                  description: 'An array of references to the external resources using subnet.'
                                },
                                serviceAssociationLinks: {
                                  readOnly: true,
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Resource navigation link properties format.',
                                        properties: {
                                          linkedResourceType: {
                                            type: 'string',
                                            description: 'Resource type of the linked resource.'
                                          },
                                          link: {
                                            type: 'string',
                                            description: 'Link to the external resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service association link resource.',
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
                                          allowDelete: {
                                            type: 'boolean',
                                            description: 'If true, the resource can be deleted.'
                                          },
                                          locations: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'A list of locations.'
                                          }
                                        }
                                      },
                                      name: {
                                        type: 'string',
                                        description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource type.'
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
                                    description: 'ServiceAssociationLink resource.'
                                  },
                                  description: 'An array of references to services injecting into this subnet.'
                                },
                                delegations: {
                                  type: 'array',
                                  items: {
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the subnet.',
                                        properties: {
                                          serviceName: {
                                            type: 'string',
                                            description: 'The name of the service to whom the subnet should be delegated (e.g. Microsoft.Sql/servers).'
                                          },
                                          actions: {
                                            readOnly: true,
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The actions permitted to the service upon delegation.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service delegation resource.',
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
                                        description: 'The name of the resource that is unique within a subnet. This name can be used to access the resource.'
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
                                  default: 'Disabled',
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
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the application gateway IP configuration.',
                                        properties: {
                                          subnet: {
                                            description: 'Reference to the subnet resource. A subnet from where application gateway gets its private address.',
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            'x-ms-azure-resource': true
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the application gateway IP configuration resource.',
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
                                        description: 'Name of the IP configuration that is unique within an Application Gateway.'
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
                            type: {
                              type: 'string',
                              description: 'Resource type.'
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
                          ]
                        },
                        publicIPAddress: {
                          description: 'The reference to the Public IP resource.',
                          properties: <ref *5> {
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
                                  'x-ms-enum': {
                                    name: 'IPVersion',
                                    modelAsString: true
                                  }
                                },
                                ipConfiguration: {
                                  readOnly: true,
                                  description: 'The IP configuration associated with the public IP address.',
                                  properties: {
                                    properties: {
                                      'x-ms-client-flatten': true,
                                      description: 'Properties of the IP configuration.',
                                      properties: {
                                        privateIPAddress: {
                                          type: 'string',
                                          description: 'The private IP address of the IP configuration.'
                                        },
                                        privateIPAllocationMethod: {
                                          description: 'The private IP address allocation method.',
                                          default: 'Dynamic',
                                          type: 'string',
                                          enum: [ 'Static', 'Dynamic' ],
                                          'x-ms-enum': {
                                            name: 'IPAllocationMethod',
                                            modelAsString: true
                                          }
                                        },
                                        subnet: {
                                          description: 'The reference to the subnet resource.',
                                          properties: <ref *4> {
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
                                                  items: [Object],
                                                  description: 'List of address prefixes for the subnet.'
                                                },
                                                networkSecurityGroup: {
                                                  description: 'The reference to the NetworkSecurityGroup resource.',
                                                  properties: [Object],
                                                  allOf: [Array]
                                                },
                                                routeTable: {
                                                  description: 'The reference to the RouteTable resource.',
                                                  properties: [Object],
                                                  allOf: [Array]
                                                },
                                                natGateway: {
                                                  description: 'Nat gateway associated with this subnet.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
                                                },
                                                serviceEndpoints: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of service endpoints.'
                                                },
                                                serviceEndpointPolicies: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of service endpoint policies.'
                                                },
                                                privateEndpoints: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to private endpoints.'
                                                },
                                                ipConfigurations: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to the network interface IP configurations using subnet.'
                                                },
                                                ipConfigurationProfiles: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'Array of IP configuration profiles which reference this subnet.'
                                                },
                                                ipAllocations: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'Array of IpAllocation which reference this subnet.'
                                                },
                                                resourceNavigationLinks: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to the external resources using subnet.'
                                                },
                                                serviceAssociationLinks: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'An array of references to services injecting into this subnet.'
                                                },
                                                delegations: {
                                                  type: 'array',
                                                  items: [Object],
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
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                privateEndpointNetworkPolicies: {
                                                  type: 'string',
                                                  default: 'Disabled',
                                                  description: 'Enable or Disable apply network policies on private end point in the subnet.',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                privateLinkServiceNetworkPolicies: {
                                                  type: 'string',
                                                  default: 'Enabled',
                                                  description: 'Enable or Disable apply network policies on private link service in the subnet.',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                applicationGatewayIpConfigurations: {
                                                  type: 'array',
                                                  items: [Object],
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
                                            type: {
                                              type: 'string',
                                              description: 'Resource type.'
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
                                          ]
                                        },
                                        publicIPAddress: {
                                          description: 'The reference to the public IP resource.',
                                          properties: [Circular *5],
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
                                                  additionalProperties: [Object],
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
                                      readOnly: false,
                                      description: 'The DDoS custom policy associated with the public IP.',
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      'x-ms-azure-resource': true
                                    },
                                    protectionCoverage: {
                                      readOnly: false,
                                      type: 'string',
                                      enum: [ 'Basic', 'Standard' ],
                                      'x-ms-enum': {
                                        name: 'DdosSettingsProtectionCoverage',
                                        modelAsString: true
                                      },
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
                                  description: 'The list of tags associated with the public IP address.'
                                },
                                ipAddress: {
                                  type: 'string',
                                  description: 'The IP address associated with the public IP address resource.'
                                },
                                publicIPPrefix: {
                                  description: 'The Public IP Prefix this Public IP Address should be allocated from.',
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
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
                                  properties: [Circular *5],
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
                                natGateway: {
                                  description: 'The NatGateway for the Public IP address.',
                                  properties: {
                                    sku: {
                                      description: 'The nat gateway SKU.',
                                      properties: {
                                        name: {
                                          type: 'string',
                                          description: 'Name of Nat Gateway SKU.',
                                          enum: [ 'Standard' ],
                                          'x-ms-enum': {
                                            name: 'NatGatewaySkuName',
                                            modelAsString: true
                                          }
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                  properties: [Circular *5],
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
                        publicIPPrefix: {
                          description: 'The reference to the Public IP Prefix resource.',
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          'x-ms-azure-resource': true
                        },
                        gatewayLoadBalancer: {
                          description: 'The reference to gateway load balancer frontend IP.',
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
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
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/networkInterface.json).
