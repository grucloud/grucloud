---
id: DscpConfiguration
title: DscpConfiguration
---
Provides a **DscpConfiguration** from the **Network** group
## Examples
### Create DSCP Configuration
```js
exports.createResources = () => [
  {
    type: "DscpConfiguration",
    group: "Network",
    name: "myDscpConfiguration",
    properties: () => ({
      properties: {
        qosDefinitionCollection: [
          {
            markings: [1],
            sourceIpRanges: [{ startIP: "127.0.0.1", endIP: "127.0.0.2" }],
            destinationIpRanges: [
              { startIP: "127.0.10.1", endIP: "127.0.10.2" },
            ],
            sourcePortRanges: [
              { start: 10, end: 11 },
              { start: 20, end: 21 },
            ],
            destinationPortRanges: [{ start: 15, end: 15 }],
            protocol: "Tcp",
          },
          {
            markings: [2],
            sourceIpRanges: [{ startIP: "12.0.0.1", endIP: "12.0.0.2" }],
            destinationIpRanges: [{ startIP: "12.0.10.1", endIP: "12.0.10.2" }],
            sourcePortRanges: [{ start: 11, end: 12 }],
            destinationPortRanges: [{ start: 51, end: 52 }],
            protocol: "Udp",
          },
        ],
      },
      location: "eastus",
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the network interface.',
      properties: {
        markings: {
          type: 'array',
          items: { type: 'integer', format: 'int32' },
          description: 'List of markings to be used in the configuration.'
        },
        sourceIpRanges: {
          type: 'array',
          items: {
            properties: {
              startIP: { type: 'string', description: 'Start IP Address.' },
              endIP: { type: 'string', description: 'End IP Address.' }
            },
            description: 'Qos Traffic Profiler IP Range properties.'
          },
          description: 'Source IP ranges.'
        },
        destinationIpRanges: {
          type: 'array',
          items: {
            properties: {
              startIP: { type: 'string', description: 'Start IP Address.' },
              endIP: { type: 'string', description: 'End IP Address.' }
            },
            description: 'Qos Traffic Profiler IP Range properties.'
          },
          description: 'Destination IP ranges.'
        },
        sourcePortRanges: {
          type: 'array',
          items: {
            properties: {
              start: {
                type: 'integer',
                format: 'int32',
                description: 'Qos Port Range start.'
              },
              end: {
                type: 'integer',
                format: 'int32',
                description: 'Qos Port Range end.'
              }
            },
            description: 'Qos Traffic Profiler Port range properties.'
          },
          description: 'Sources port ranges.'
        },
        destinationPortRanges: {
          type: 'array',
          items: {
            properties: {
              start: {
                type: 'integer',
                format: 'int32',
                description: 'Qos Port Range start.'
              },
              end: {
                type: 'integer',
                format: 'int32',
                description: 'Qos Port Range end.'
              }
            },
            description: 'Qos Traffic Profiler Port range properties.'
          },
          description: 'Destination port ranges.'
        },
        protocol: {
          type: 'string',
          enum: [
            'DoNotUse', 'Icmp',
            'Tcp',      'Udp',
            'Gre',      'Esp',
            'Ah',       'Vxlan',
            'All'
          ],
          'x-ms-enum': { name: 'ProtocolType', modelAsString: true },
          description: 'RNM supported protocol types.'
        },
        qosDefinitionCollection: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              markings: {
                type: 'array',
                items: { type: 'integer', format: 'int32' },
                description: 'List of markings to be used in the configuration.'
              },
              sourceIpRanges: {
                type: 'array',
                items: {
                  properties: {
                    startIP: {
                      type: 'string',
                      description: 'Start IP Address.'
                    },
                    endIP: { type: 'string', description: 'End IP Address.' }
                  },
                  description: 'Qos Traffic Profiler IP Range properties.'
                },
                description: 'Source IP ranges.'
              },
              destinationIpRanges: {
                type: 'array',
                items: {
                  properties: {
                    startIP: {
                      type: 'string',
                      description: 'Start IP Address.'
                    },
                    endIP: { type: 'string', description: 'End IP Address.' }
                  },
                  description: 'Qos Traffic Profiler IP Range properties.'
                },
                description: 'Destination IP ranges.'
              },
              sourcePortRanges: {
                type: 'array',
                items: {
                  properties: {
                    start: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Qos Port Range start.'
                    },
                    end: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Qos Port Range end.'
                    }
                  },
                  description: 'Qos Traffic Profiler Port range properties.'
                },
                description: 'Sources port ranges.'
              },
              destinationPortRanges: {
                type: 'array',
                items: {
                  properties: {
                    start: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Qos Port Range start.'
                    },
                    end: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Qos Port Range end.'
                    }
                  },
                  description: 'Qos Traffic Profiler Port range properties.'
                },
                description: 'Destination port ranges.'
              },
              protocol: {
                type: 'string',
                enum: [
                  'DoNotUse', 'Icmp',
                  'Tcp',      'Udp',
                  'Gre',      'Esp',
                  'Ah',       'Vxlan',
                  'All'
                ],
                'x-ms-enum': { name: 'ProtocolType', modelAsString: true },
                description: 'RNM supported protocol types.'
              }
            },
            description: 'Quality of Service defines the traffic configuration between endpoints. Mandatory to have one marking.'
          },
          description: 'QoS object definitions'
        },
        qosCollectionId: {
          type: 'string',
          readOnly: true,
          description: 'Qos Collection ID generated by RNM.'
        },
        associatedNetworkInterfaces: {
          type: 'array',
          items: <ref *1> {
            properties: {
              extendedLocation: {
                description: 'The extended location of the network interface.',
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
                description: 'Properties of the network interface.',
                properties: {
                  virtualMachine: {
                    description: 'The reference to a virtual machine.',
                    readOnly: true,
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
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
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Network security rule.'
                            },
                            description: 'A collection of security rules of the network security group.'
                          },
                          defaultSecurityRules: {
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
                              description: 'Network security rule.'
                            },
                            description: 'The default security rules of network security group.'
                          },
                          networkInterfaces: {
                            readOnly: true,
                            type: 'array',
                            items: [Circular *1],
                            description: 'A collection of references to network interfaces.'
                          },
                          subnets: {
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
                              description: 'Subnet in a virtual network resource.'
                            },
                            description: 'A collection of references to subnets.'
                          },
                          flowLogs: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ],
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
                  privateEndpoint: {
                    readOnly: true,
                    description: 'A reference to the private endpoint to which the network interface is linked.',
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
                              type: {
                                type: 'string',
                                description: 'Resource type.'
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
                          networkInterfaces: {
                            type: 'array',
                            readOnly: true,
                            items: [Circular *1],
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
                  ipConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Network interface IP configuration properties.',
                          properties: {
                            gatewayLoadBalancer: {
                              description: 'The reference to gateway load balancer frontend IP.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            virtualNetworkTaps: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Virtual Network Tap resource.'
                              },
                              description: 'The reference to Virtual Network Taps.'
                            },
                            applicationGatewayBackendAddressPools: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Backend Address Pool of an application gateway.'
                              },
                              description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                            },
                            loadBalancerBackendAddressPools: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Pool of backend IP addresses.'
                              },
                              description: 'The reference to LoadBalancerBackendAddressPool resource.'
                            },
                            loadBalancerInboundNatRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
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
                              'x-ms-enum': {
                                name: 'IPVersion',
                                modelAsString: true
                              }
                            },
                            subnet: {
                              description: 'Subnet bound to the IP configuration.',
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ]
                            },
                            primary: {
                              type: 'boolean',
                              description: 'Whether this is a primary customer address on the network interface.'
                            },
                            publicIPAddress: {
                              description: 'Public IP address bound to the IP configuration.',
                              properties: {
                                extendedLocation: [Object],
                                sku: [Object],
                                properties: [Object],
                                etag: [Object],
                                zones: [Object]
                              },
                              allOf: [ [Object] ]
                            },
                            applicationSecurityGroups: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
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
                                groupId: [Object],
                                requiredMemberName: [Object],
                                fqdns: [Object]
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
                      description: 'IPConfiguration in a network interface.'
                    },
                    description: 'A list of IPConfigurations of the network interface.'
                  },
                  tapConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the Virtual Network Tap configuration.',
                          properties: {
                            virtualNetworkTap: {
                              description: 'The reference to the Virtual Network Tap resource.',
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ]
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the network interface tap configuration resource.',
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
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Sub Resource type.'
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
                      description: 'Tap configuration in a Network Interface.'
                    },
                    description: 'A list of TapConfigurations of the network interface.'
                  },
                  dnsSettings: {
                    description: 'The DNS settings in network interface.',
                    properties: {
                      dnsServers: {
                        type: 'array',
                        items: { type: 'string' },
                        description: "List of DNS servers IP addresses. Use 'AzureProvidedDNS' to switch to azure provided DNS resolution. 'AzureProvidedDNS' value cannot be combined with other IPs, it must be the only value in dnsServers collection."
                      },
                      appliedDnsServers: {
                        readOnly: true,
                        type: 'array',
                        items: { type: 'string' },
                        description: 'If the VM that uses this NIC is part of an Availability Set, then this list will have the union of all DNS servers from all NICs that are part of the Availability Set. This property is what is configured on each of those VMs.'
                      },
                      internalDnsNameLabel: {
                        type: 'string',
                        description: 'Relative DNS name for this NIC used for internal communications between VMs in the same virtual network.'
                      },
                      internalFqdn: {
                        readOnly: true,
                        type: 'string',
                        description: 'Fully qualified DNS name supporting internal communications between VMs in the same virtual network.'
                      },
                      internalDomainNameSuffix: {
                        readOnly: true,
                        type: 'string',
                        description: 'Even if internalDnsNameLabel is not specified, a DNS entry is created for the primary NIC of the VM. This DNS name can be constructed by concatenating the VM name with the value of internalDomainNameSuffix.'
                      }
                    }
                  },
                  macAddress: {
                    readOnly: true,
                    type: 'string',
                    description: 'The MAC address of the network interface.'
                  },
                  primary: {
                    readOnly: true,
                    type: 'boolean',
                    description: 'Whether this is a primary network interface on a virtual machine.'
                  },
                  vnetEncryptionSupported: {
                    readOnly: true,
                    type: 'boolean',
                    description: 'Whether the virtual machine this nic is attached to supports encryption.'
                  },
                  enableAcceleratedNetworking: {
                    type: 'boolean',
                    description: 'If the network interface is configured for accelerated networking. Not applicable to VM sizes which require accelerated networking.'
                  },
                  enableIPForwarding: {
                    type: 'boolean',
                    description: 'Indicates whether IP forwarding is enabled on this network interface.'
                  },
                  hostedWorkloads: {
                    type: 'array',
                    items: { type: 'string' },
                    readOnly: true,
                    description: 'A list of references to linked BareMetal resources.'
                  },
                  dscpConfiguration: {
                    description: 'A reference to the dscp configuration to which the network interface is linked.',
                    readOnly: true,
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  resourceGuid: {
                    readOnly: true,
                    type: 'string',
                    description: 'The resource GUID property of the network interface resource.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the network interface resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  workloadType: {
                    type: 'string',
                    description: 'WorkloadType of the NetworkInterface for BareMetal resources'
                  },
                  nicType: {
                    type: 'string',
                    description: 'Type of Network Interface resource.',
                    enum: [ 'Standard', 'Elastic' ],
                    'x-ms-enum': {
                      name: 'NetworkInterfaceNicType',
                      modelAsString: true
                    }
                  },
                  privateLinkService: {
                    description: 'Privatelinkservice of the network interface resource.',
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
                        description: 'Properties of the private link service.',
                        properties: {
                          loadBalancerFrontendIpConfigurations: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object],
                                zones: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Frontend IP address of the load balancer.'
                            },
                            description: 'An array of references to the load balancer IP configurations.'
                          },
                          ipConfigurations: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'The private link service ip configuration.'
                            },
                            description: 'An array of private link service IP configurations.'
                          },
                          networkInterfaces: {
                            type: 'array',
                            readOnly: true,
                            items: [Circular *1],
                            description: 'An array of references to the network interfaces created for this private link service.'
                          },
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the private link service resource.',
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
                          privateEndpointConnections: {
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
                              description: 'PrivateEndpointConnection resource.'
                            },
                            description: 'An array of list about connections to the private endpoint.'
                          },
                          visibility: {
                            allOf: [
                              {
                                properties: [Object],
                                description: 'The base resource set for visibility and auto-approval.'
                              }
                            ],
                            description: 'The visibility list of the private link service.'
                          },
                          autoApproval: {
                            allOf: [
                              {
                                properties: [Object],
                                description: 'The base resource set for visibility and auto-approval.'
                              }
                            ],
                            description: 'The auto-approval list of the private link service.'
                          },
                          fqdns: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'The list of Fqdn.'
                          },
                          alias: {
                            readOnly: true,
                            type: 'string',
                            description: 'The alias of the private link service.'
                          },
                          enableProxyProtocol: {
                            type: 'boolean',
                            description: 'Whether the private link service is enabled for proxy protocol or not.'
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
                  migrationPhase: {
                    type: 'string',
                    description: 'Migration phase of Network Interface resource.',
                    enum: [
                      'None',
                      'Prepare',
                      'Commit',
                      'Abort',
                      'Committed'
                    ],
                    'x-ms-enum': {
                      name: 'NetworkInterfaceMigrationPhase',
                      modelAsString: true
                    }
                  },
                  auxiliaryMode: {
                    type: 'string',
                    description: 'Auxiliary mode of Network Interface resource.',
                    enum: [ 'None', 'MaxConnections', 'Floating' ],
                    'x-ms-enum': {
                      name: 'NetworkInterfaceAuxiliaryMode',
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
            description: 'A network interface in a resource group.'
          },
          readOnly: true,
          description: 'Associated Network Interfaces to the DSCP Configuration.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the DSCP Configuration resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the DSCP Configuration resource.',
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
  description: 'Differentiated Services Code Point configuration for any given network interface'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/dscpConfiguration.json).
