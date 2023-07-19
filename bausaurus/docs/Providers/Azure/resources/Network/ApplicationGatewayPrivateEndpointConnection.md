---
id: ApplicationGatewayPrivateEndpointConnection
title: ApplicationGatewayPrivateEndpointConnection
---
Provides a **ApplicationGatewayPrivateEndpointConnection** from the **Network** group
## Examples
### Update Application Gateway Private Endpoint Connection
```js
exports.createResources = () => [
  {
    type: "ApplicationGatewayPrivateEndpointConnection",
    group: "Network",
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
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      applicationGateway: "myApplicationGateway",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ApplicationGateway](../Network/ApplicationGateway.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the application gateway private endpoint connection.',
      properties: {
        privateEndpoint: {
          readOnly: true,
          description: 'The resource of private end point.',
          properties: <ref *2> {
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
                  properties: <ref *3> {
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
                          properties: <ref *1> {
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
                                          description: {
                                            type: 'string',
                                            description: 'A description for this rule. Restricted to 140 chars.'
                                          },
                                          protocol: {
                                            type: 'string',
                                            description: 'Network protocol this rule applies to.',
                                            enum: [
                                              'Tcp',
                                              'Udp',
                                              'Icmp',
                                              'Esp',
                                              '*',
                                              'Ah'
                                            ],
                                            'x-ms-enum': {
                                              name: 'SecurityRuleProtocol',
                                              modelAsString: true
                                            }
                                          },
                                          sourcePortRange: {
                                            type: 'string',
                                            description: "The source port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                          },
                                          destinationPortRange: {
                                            type: 'string',
                                            description: "The destination port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                          },
                                          sourceAddressPrefix: {
                                            type: 'string',
                                            description: "The CIDR or source IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used. If this is an ingress rule, specifies where network traffic originates from."
                                          },
                                          sourceAddressPrefixes: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The CIDR or source IP ranges.'
                                          },
                                          sourceApplicationSecurityGroups: {
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
                                            description: 'The application security group specified as source.'
                                          },
                                          destinationAddressPrefix: {
                                            type: 'string',
                                            description: "The destination address prefix. CIDR or destination IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used."
                                          },
                                          destinationAddressPrefixes: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The destination address prefixes. CIDR or destination IP ranges.'
                                          },
                                          destinationApplicationSecurityGroups: {
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
                                            description: 'The application security group specified as destination.'
                                          },
                                          sourcePortRanges: {
                                            type: 'array',
                                            items: {
                                              type: 'string',
                                              description: 'The source port.'
                                            },
                                            description: 'The source port ranges.'
                                          },
                                          destinationPortRanges: {
                                            type: 'array',
                                            items: {
                                              type: 'string',
                                              description: 'The destination port.'
                                            },
                                            description: 'The destination port ranges.'
                                          },
                                          access: {
                                            description: 'The network traffic is allowed or denied.',
                                            type: 'string',
                                            enum: [ 'Allow', 'Deny' ],
                                            'x-ms-enum': {
                                              name: 'SecurityRuleAccess',
                                              modelAsString: true
                                            }
                                          },
                                          priority: {
                                            type: 'integer',
                                            format: 'int32',
                                            description: 'The priority of the rule. The value can be between 100 and 4096. The priority number must be unique for each rule in the collection. The lower the priority number, the higher the priority of the rule.'
                                          },
                                          direction: {
                                            description: 'The direction of the rule. The direction specifies if rule will be evaluated on incoming or outgoing traffic.',
                                            type: 'string',
                                            enum: [ 'Inbound', 'Outbound' ],
                                            'x-ms-enum': {
                                              name: 'SecurityRuleDirection',
                                              modelAsString: true
                                            }
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the security rule resource.',
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
                                          description: {
                                            type: 'string',
                                            description: 'A description for this rule. Restricted to 140 chars.'
                                          },
                                          protocol: {
                                            type: 'string',
                                            description: 'Network protocol this rule applies to.',
                                            enum: [
                                              'Tcp',
                                              'Udp',
                                              'Icmp',
                                              'Esp',
                                              '*',
                                              'Ah'
                                            ],
                                            'x-ms-enum': {
                                              name: 'SecurityRuleProtocol',
                                              modelAsString: true
                                            }
                                          },
                                          sourcePortRange: {
                                            type: 'string',
                                            description: "The source port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                          },
                                          destinationPortRange: {
                                            type: 'string',
                                            description: "The destination port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                          },
                                          sourceAddressPrefix: {
                                            type: 'string',
                                            description: "The CIDR or source IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used. If this is an ingress rule, specifies where network traffic originates from."
                                          },
                                          sourceAddressPrefixes: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The CIDR or source IP ranges.'
                                          },
                                          sourceApplicationSecurityGroups: {
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
                                            description: 'The application security group specified as source.'
                                          },
                                          destinationAddressPrefix: {
                                            type: 'string',
                                            description: "The destination address prefix. CIDR or destination IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used."
                                          },
                                          destinationAddressPrefixes: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The destination address prefixes. CIDR or destination IP ranges.'
                                          },
                                          destinationApplicationSecurityGroups: {
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
                                            description: 'The application security group specified as destination.'
                                          },
                                          sourcePortRanges: {
                                            type: 'array',
                                            items: {
                                              type: 'string',
                                              description: 'The source port.'
                                            },
                                            description: 'The source port ranges.'
                                          },
                                          destinationPortRanges: {
                                            type: 'array',
                                            items: {
                                              type: 'string',
                                              description: 'The destination port.'
                                            },
                                            description: 'The destination port ranges.'
                                          },
                                          access: {
                                            description: 'The network traffic is allowed or denied.',
                                            type: 'string',
                                            enum: [ 'Allow', 'Deny' ],
                                            'x-ms-enum': {
                                              name: 'SecurityRuleAccess',
                                              modelAsString: true
                                            }
                                          },
                                          priority: {
                                            type: 'integer',
                                            format: 'int32',
                                            description: 'The priority of the rule. The value can be between 100 and 4096. The priority number must be unique for each rule in the collection. The lower the priority number, the higher the priority of the rule.'
                                          },
                                          direction: {
                                            description: 'The direction of the rule. The direction specifies if rule will be evaluated on incoming or outgoing traffic.',
                                            type: 'string',
                                            enum: [ 'Inbound', 'Outbound' ],
                                            'x-ms-enum': {
                                              name: 'SecurityRuleDirection',
                                              modelAsString: true
                                            }
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the security rule resource.',
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            'x-ms-azure-resource': true
                                          },
                                          networkSecurityGroup: {
                                            description: 'The reference to the NetworkSecurityGroup resource.',
                                            properties: [Circular *1],
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
                                          privateEndpoint: {
                                            readOnly: true,
                                            description: 'A reference to the private endpoint to which the network interface is linked.',
                                            properties: [Circular *2],
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
                                          ipConfigurations: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Network interface IP configuration properties.',
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
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'Sub Resource type.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
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
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
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
                                                  name: [Object],
                                                  type: [Object]
                                                }
                                              },
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Properties of the private link service.',
                                                properties: {
                                                  loadBalancerFrontendIpConfigurations: [Object],
                                                  ipConfigurations: [Object],
                                                  networkInterfaces: [Object],
                                                  provisioningState: [Object],
                                                  privateEndpointConnections: [Object],
                                                  visibility: [Object],
                                                  autoApproval: [Object],
                                                  fqdns: [Object],
                                                  alias: [Object],
                                                  enableProxyProtocol: [Object]
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
                                            enum: [
                                              'None',
                                              'MaxConnections',
                                              'Floating'
                                            ],
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
                                    description: 'A network interface in a resource group.'
                                  },
                                  description: 'A collection of references to network interfaces.'
                                },
                                subnets: {
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
                                          targetResourceId: {
                                            description: 'ID of network security group to which flow log will be applied.',
                                            type: 'string'
                                          },
                                          targetResourceGuid: {
                                            readOnly: true,
                                            description: 'Guid of network security group to which flow log will be applied.',
                                            type: 'string'
                                          },
                                          storageId: {
                                            description: 'ID of the storage account which is used to store the flow log.',
                                            type: 'string'
                                          },
                                          enabled: {
                                            description: 'Flag to enable/disable flow logging.',
                                            type: 'boolean'
                                          },
                                          retentionPolicy: {
                                            description: 'Parameters that define the retention policy for flow log.',
                                            properties: {
                                              days: {
                                                description: 'Number of days to retain flow log records.',
                                                type: 'integer',
                                                format: 'int32',
                                                default: 0
                                              },
                                              enabled: {
                                                description: 'Flag to enable/disable retention.',
                                                type: 'boolean',
                                                default: false
                                              }
                                            }
                                          },
                                          format: {
                                            description: 'Parameters that define the flow log format.',
                                            properties: {
                                              type: {
                                                type: 'string',
                                                description: 'The file type of flow log.',
                                                enum: [ 'JSON' ],
                                                'x-ms-enum': {
                                                  name: 'FlowLogFormatType',
                                                  modelAsString: true
                                                }
                                              },
                                              version: {
                                                description: 'The version (revision) of the flow log.',
                                                type: 'integer',
                                                format: 'int32',
                                                default: 0
                                              }
                                            }
                                          },
                                          flowAnalyticsConfiguration: {
                                            description: 'Parameters that define the configuration of traffic analytics.',
                                            properties: {
                                              networkWatcherFlowAnalyticsConfiguration: {
                                                description: 'Parameters that define the configuration of traffic analytics.',
                                                properties: {
                                                  enabled: [Object],
                                                  workspaceId: [Object],
                                                  workspaceRegion: [Object],
                                                  workspaceResourceId: [Object],
                                                  trafficAnalyticsInterval: [Object]
                                                }
                                              }
                                            }
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the flow log.',
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
                                          addressPrefix: {
                                            type: 'string',
                                            description: 'The destination CIDR to which the route applies.'
                                          },
                                          nextHopType: {
                                            description: 'The type of Azure hop the packet should be sent to.',
                                            type: 'string',
                                            enum: [
                                              'VirtualNetworkGateway',
                                              'VnetLocal',
                                              'Internet',
                                              'VirtualAppliance',
                                              'None'
                                            ],
                                            'x-ms-enum': {
                                              name: 'RouteNextHopType',
                                              modelAsString: true
                                            }
                                          },
                                          nextHopIpAddress: {
                                            type: 'string',
                                            description: 'The IP address packets should be forwarded to. Next hop values are only allowed in routes where the next hop type is VirtualAppliance.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the route resource.',
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
                                          hasBgpOverride: {
                                            type: 'boolean',
                                            description: 'A value indicating whether this route overrides overlapping BGP routes regardless of LPM.'
                                          }
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
                                    description: 'Route resource.'
                                  },
                                  description: 'Collection of routes contained within a route table.'
                                },
                                subnets: {
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
                                          properties: {
                                            description: {
                                              type: 'string',
                                              description: 'A description for this rule. Restricted to 140 chars.'
                                            },
                                            service: {
                                              type: 'string',
                                              description: 'Service endpoint name.'
                                            },
                                            serviceResources: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'A list of service resources.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the service endpoint policy definition resource.',
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
                                          type: 'string',
                                          description: 'The type of the resource.'
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
                                      description: 'Service Endpoint policy definitions.'
                                    },
                                    description: 'A collection of service endpoint policy definitions of the service endpoint policy.'
                                  },
                                  subnets: {
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
                            description: 'Private endpoint resource.'
                          },
                          description: 'An array of references to private endpoints.'
                        },
                        ipConfigurations: {
                          readOnly: true,
                          type: 'array',
                          items: {
                            properties: <ref *4> {
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
                                  publicIPAddress: {
                                    description: 'The reference to the public IP resource.',
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
                                            properties: [Circular *4],
                                            allOf: [
                                              {
                                                properties: { id: [Object] },
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
                                                properties: { id: [Object] },
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
                                          natGateway: {
                                            description: 'The NatGateway for the Public IP address.',
                                            properties: {
                                              sku: {
                                                description: 'The nat gateway SKU.',
                                                properties: { name: [Object] }
                                              },
                                              properties: {
                                                'x-ms-client-flatten': true,
                                                description: 'Nat Gateway properties.',
                                                properties: {
                                                  idleTimeoutInMinutes: [Object],
                                                  publicIpAddresses: [Object],
                                                  publicIpPrefixes: [Object],
                                                  subnets: [Object],
                                                  resourceGuid: [Object],
                                                  provisioningState: [Object]
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
                networkInterfaces: {
                  type: 'array',
                  readOnly: true,
                  items: <ref *6> {
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
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            'x-ms-azure-resource': true
                          },
                          networkSecurityGroup: {
                            description: 'The reference to the NetworkSecurityGroup resource.',
                            properties: <ref *1> {
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
                                            description: {
                                              type: 'string',
                                              description: 'A description for this rule. Restricted to 140 chars.'
                                            },
                                            protocol: {
                                              type: 'string',
                                              description: 'Network protocol this rule applies to.',
                                              enum: [
                                                'Tcp',
                                                'Udp',
                                                'Icmp',
                                                'Esp',
                                                '*',
                                                'Ah'
                                              ],
                                              'x-ms-enum': {
                                                name: 'SecurityRuleProtocol',
                                                modelAsString: true
                                              }
                                            },
                                            sourcePortRange: {
                                              type: 'string',
                                              description: "The source port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                            },
                                            destinationPortRange: {
                                              type: 'string',
                                              description: "The destination port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                            },
                                            sourceAddressPrefix: {
                                              type: 'string',
                                              description: "The CIDR or source IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used. If this is an ingress rule, specifies where network traffic originates from."
                                            },
                                            sourceAddressPrefixes: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'The CIDR or source IP ranges.'
                                            },
                                            sourceApplicationSecurityGroups: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'An application security group in a resource group.'
                                              },
                                              description: 'The application security group specified as source.'
                                            },
                                            destinationAddressPrefix: {
                                              type: 'string',
                                              description: "The destination address prefix. CIDR or destination IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used."
                                            },
                                            destinationAddressPrefixes: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'The destination address prefixes. CIDR or destination IP ranges.'
                                            },
                                            destinationApplicationSecurityGroups: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'An application security group in a resource group.'
                                              },
                                              description: 'The application security group specified as destination.'
                                            },
                                            sourcePortRanges: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                description: 'The source port.'
                                              },
                                              description: 'The source port ranges.'
                                            },
                                            destinationPortRanges: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                description: 'The destination port.'
                                              },
                                              description: 'The destination port ranges.'
                                            },
                                            access: {
                                              description: 'The network traffic is allowed or denied.',
                                              type: 'string',
                                              enum: [ 'Allow', 'Deny' ],
                                              'x-ms-enum': {
                                                name: 'SecurityRuleAccess',
                                                modelAsString: true
                                              }
                                            },
                                            priority: {
                                              type: 'integer',
                                              format: 'int32',
                                              description: 'The priority of the rule. The value can be between 100 and 4096. The priority number must be unique for each rule in the collection. The lower the priority number, the higher the priority of the rule.'
                                            },
                                            direction: {
                                              description: 'The direction of the rule. The direction specifies if rule will be evaluated on incoming or outgoing traffic.',
                                              type: 'string',
                                              enum: [ 'Inbound', 'Outbound' ],
                                              'x-ms-enum': {
                                                name: 'SecurityRuleDirection',
                                                modelAsString: true
                                              }
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the security rule resource.',
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
                                            description: {
                                              type: 'string',
                                              description: 'A description for this rule. Restricted to 140 chars.'
                                            },
                                            protocol: {
                                              type: 'string',
                                              description: 'Network protocol this rule applies to.',
                                              enum: [
                                                'Tcp',
                                                'Udp',
                                                'Icmp',
                                                'Esp',
                                                '*',
                                                'Ah'
                                              ],
                                              'x-ms-enum': {
                                                name: 'SecurityRuleProtocol',
                                                modelAsString: true
                                              }
                                            },
                                            sourcePortRange: {
                                              type: 'string',
                                              description: "The source port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                            },
                                            destinationPortRange: {
                                              type: 'string',
                                              description: "The destination port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                                            },
                                            sourceAddressPrefix: {
                                              type: 'string',
                                              description: "The CIDR or source IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used. If this is an ingress rule, specifies where network traffic originates from."
                                            },
                                            sourceAddressPrefixes: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'The CIDR or source IP ranges.'
                                            },
                                            sourceApplicationSecurityGroups: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'An application security group in a resource group.'
                                              },
                                              description: 'The application security group specified as source.'
                                            },
                                            destinationAddressPrefix: {
                                              type: 'string',
                                              description: "The destination address prefix. CIDR or destination IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used."
                                            },
                                            destinationAddressPrefixes: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'The destination address prefixes. CIDR or destination IP ranges.'
                                            },
                                            destinationApplicationSecurityGroups: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'An application security group in a resource group.'
                                              },
                                              description: 'The application security group specified as destination.'
                                            },
                                            sourcePortRanges: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                description: 'The source port.'
                                              },
                                              description: 'The source port ranges.'
                                            },
                                            destinationPortRanges: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                description: 'The destination port.'
                                              },
                                              description: 'The destination port ranges.'
                                            },
                                            access: {
                                              description: 'The network traffic is allowed or denied.',
                                              type: 'string',
                                              enum: [ 'Allow', 'Deny' ],
                                              'x-ms-enum': {
                                                name: 'SecurityRuleAccess',
                                                modelAsString: true
                                              }
                                            },
                                            priority: {
                                              type: 'integer',
                                              format: 'int32',
                                              description: 'The priority of the rule. The value can be between 100 and 4096. The priority number must be unique for each rule in the collection. The lower the priority number, the higher the priority of the rule.'
                                            },
                                            direction: {
                                              description: 'The direction of the rule. The direction specifies if rule will be evaluated on incoming or outgoing traffic.',
                                              type: 'string',
                                              enum: [ 'Inbound', 'Outbound' ],
                                              'x-ms-enum': {
                                                name: 'SecurityRuleDirection',
                                                modelAsString: true
                                              }
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the security rule resource.',
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
                                      description: 'Network security rule.'
                                    },
                                    description: 'The default security rules of network security group.'
                                  },
                                  networkInterfaces: {
                                    readOnly: true,
                                    type: 'array',
                                    items: [Circular *6],
                                    description: 'A collection of references to network interfaces.'
                                  },
                                  subnets: {
                                    readOnly: true,
                                    type: 'array',
                                    items: {
                                      properties: <ref *3> {
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
                                              properties: [Circular *1],
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
                                                properties: [Circular *2],
                                                allOf: [ [Object] ],
                                                description: 'Private endpoint resource.'
                                              },
                                              description: 'An array of references to private endpoints.'
                                            },
                                            ipConfigurations: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: <ref *4> {
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
                                            targetResourceId: {
                                              description: 'ID of network security group to which flow log will be applied.',
                                              type: 'string'
                                            },
                                            targetResourceGuid: {
                                              readOnly: true,
                                              description: 'Guid of network security group to which flow log will be applied.',
                                              type: 'string'
                                            },
                                            storageId: {
                                              description: 'ID of the storage account which is used to store the flow log.',
                                              type: 'string'
                                            },
                                            enabled: {
                                              description: 'Flag to enable/disable flow logging.',
                                              type: 'boolean'
                                            },
                                            retentionPolicy: {
                                              description: 'Parameters that define the retention policy for flow log.',
                                              properties: {
                                                days: {
                                                  description: 'Number of days to retain flow log records.',
                                                  type: 'integer',
                                                  format: 'int32',
                                                  default: 0
                                                },
                                                enabled: {
                                                  description: 'Flag to enable/disable retention.',
                                                  type: 'boolean',
                                                  default: false
                                                }
                                              }
                                            },
                                            format: {
                                              description: 'Parameters that define the flow log format.',
                                              properties: {
                                                type: {
                                                  type: 'string',
                                                  description: 'The file type of flow log.',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                },
                                                version: {
                                                  description: 'The version (revision) of the flow log.',
                                                  type: 'integer',
                                                  format: 'int32',
                                                  default: 0
                                                }
                                              }
                                            },
                                            flowAnalyticsConfiguration: {
                                              description: 'Parameters that define the configuration of traffic analytics.',
                                              properties: {
                                                networkWatcherFlowAnalyticsConfiguration: {
                                                  description: 'Parameters that define the configuration of traffic analytics.',
                                                  properties: [Object]
                                                }
                                              }
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the flow log.',
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
                            ]
                          },
                          ipConfigurations: {
                            type: 'array',
                            items: <ref *8> {
                              properties: <ref *7> {
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
                                                properties: [Circular *7],
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
                                                items: [Circular *8],
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
                                                  properties: [Object],
                                                  description: 'Gateway load balancer tunnel interface of a load balancer backend address pool.'
                                                },
                                                description: 'An array of gateway load balancer tunnel interfaces.'
                                              },
                                              loadBalancerBackendAddresses: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Load balancer backend addresses.'
                                                },
                                                description: 'An array of backend addresses.'
                                              },
                                              backendIPConfigurations: {
                                                readOnly: true,
                                                type: 'array',
                                                items: [Circular *8],
                                                description: 'An array of references to IP addresses defined in network interfaces.'
                                              },
                                              loadBalancingRules: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                },
                                                description: 'An array of references to load balancing rules that use this backend address pool.'
                                              },
                                              outboundRule: {
                                                readOnly: true,
                                                description: 'A reference to an outbound rule that uses this backend address pool.',
                                                properties: { id: [Object] },
                                                'x-ms-azure-resource': true
                                              },
                                              outboundRules: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                },
                                                description: 'An array of references to outbound rules that use this backend address pool.'
                                              },
                                              inboundNatRules: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
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
                                                properties: { id: [Object] },
                                                'x-ms-azure-resource': true
                                              },
                                              backendIPConfiguration: {
                                                readOnly: true,
                                                description: 'A reference to a private IP address defined on a network interface of a VM. Traffic sent to the frontend port of each of the frontend IP configurations is forwarded to the backend IP.',
                                                properties: [Circular *7],
                                                allOf: [ [Object] ]
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
                                                properties: { id: [Object] },
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
                                      'x-ms-enum': {
                                        name: 'IPVersion',
                                        modelAsString: true
                                      }
                                    },
                                    subnet: {
                                      description: 'Subnet bound to the IP configuration.',
                                      properties: <ref *3> {
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
                                              properties: <ref *1> {
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
                                                properties: [Circular *2],
                                                allOf: [ [Object] ],
                                                description: 'Private endpoint resource.'
                                              },
                                              description: 'An array of references to private endpoints.'
                                            },
                                            ipConfigurations: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: <ref *4> {
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
                                              properties: <ref *4> {
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
                                                  readOnly: false,
                                                  description: 'The DDoS custom policy associated with the public IP.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
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
                                                properties: {
                                                  ipTagType: [Object],
                                                  tag: [Object]
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
                                              properties: [Circular *5],
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
                              properties: <ref *9> {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the Virtual Network Tap configuration.',
                                  properties: {
                                    virtualNetworkTap: {
                                      description: 'The reference to the Virtual Network Tap resource.',
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
                                                properties: [Circular *9],
                                                allOf: [ [Object] ]
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
                                              properties: <ref *7> {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Network interface IP configuration properties.',
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
                                            destinationLoadBalancerFrontEndIPConfiguration: {
                                              description: 'The reference to the private IP address on the internal Load Balancer that will receive the tap.',
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the load balancer probe.',
                                                  properties: [Object]
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
                                                  items: [Object],
                                                  description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
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
                                      ]
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
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
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
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the load balancer probe.',
                                          properties: {
                                            inboundNatRules: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              },
                                              description: 'An array of references to inbound rules that use this frontend IP.'
                                            },
                                            inboundNatPools: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              },
                                              description: 'An array of references to inbound pools that use this frontend IP.'
                                            },
                                            outboundRules: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              },
                                              description: 'An array of references to outbound rules that use this frontend IP.'
                                            },
                                            loadBalancingRules: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
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
                                              'x-ms-enum': {
                                                name: 'IPVersion',
                                                modelAsString: true
                                              }
                                            },
                                            subnet: {
                                              description: 'The reference to the subnet resource.',
                                              properties: <ref *3> {
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
                                            publicIPAddress: {
                                              description: 'The reference to the Public IP resource.',
                                              properties: <ref *5> {
                                                extendedLocation: {
                                                  description: 'The extended location of the public ip address.',
                                                  properties: [Object]
                                                },
                                                sku: {
                                                  description: 'The public IP address SKU.',
                                                  properties: [Object]
                                                },
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Public IP address properties.',
                                                  properties: [Object]
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                },
                                                zones: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
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
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'Frontend IP address of the load balancer.'
                                    },
                                    description: 'An array of references to the load balancer IP configurations.'
                                  },
                                  ipConfigurations: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the private link service ip configuration.',
                                          properties: {
                                            privateIPAddress: {
                                              type: 'string',
                                              description: 'The private IP address of the IP configuration.'
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
                                            subnet: {
                                              description: 'The reference to the subnet resource.',
                                              properties: <ref *3> {
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
                                            primary: {
                                              type: 'boolean',
                                              description: 'Whether the ip configuration is primary or not.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the private link service IP configuration resource.',
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
                                            privateIPAddressVersion: {
                                              description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                                              type: 'string',
                                              enum: [ 'IPv4', 'IPv6' ],
                                              'x-ms-enum': {
                                                name: 'IPVersion',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'The name of private link service ip configuration.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        },
                                        type: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'The resource type.'
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
                                      description: 'The private link service ip configuration.'
                                    },
                                    description: 'An array of private link service IP configurations.'
                                  },
                                  networkInterfaces: {
                                    type: 'array',
                                    readOnly: true,
                                    items: [Circular *6],
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
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the private end point connection.',
                                          properties: {
                                            privateEndpoint: {
                                              readOnly: true,
                                              description: 'The resource of private end point.',
                                              properties: [Circular *2],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Common resource representation.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ]
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
                                              description: 'The provisioning state of the private endpoint connection resource.',
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
                                            linkIdentifier: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'The consumer link id.'
                                            }
                                          }
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
                                      description: 'PrivateEndpointConnection resource.'
                                    },
                                    description: 'An array of list about connections to the private endpoint.'
                                  },
                                  visibility: {
                                    allOf: [
                                      {
                                        properties: {
                                          subscriptions: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The list of subscriptions.'
                                          }
                                        },
                                        description: 'The base resource set for visibility and auto-approval.'
                                      }
                                    ],
                                    description: 'The visibility list of the private link service.'
                                  },
                                  autoApproval: {
                                    allOf: [
                                      {
                                        properties: {
                                          subscriptions: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'The list of subscriptions.'
                                          }
                                        },
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
                      properties: {
                        'x-ms-client-flatten': true,
                        description: 'Properties of the private link service connection.',
                        properties: {
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the private link service connection resource.',
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
                          privateLinkServiceId: {
                            type: 'string',
                            description: 'The resource id of private link service.'
                          },
                          groupIds: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'The ID(s) of the group(s) obtained from the remote resource that this private endpoint should connect to.'
                          },
                          requestMessage: {
                            type: 'string',
                            description: 'A message passed to the owner of the remote resource with this connection request. Restricted to 140 chars.'
                          },
                          privateLinkServiceConnectionState: {
                            description: 'A collection of read-only information about the state of the connection to the remote resource.',
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
                          }
                        }
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
                        properties: {
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the private link service connection resource.',
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
                          privateLinkServiceId: {
                            type: 'string',
                            description: 'The resource id of private link service.'
                          },
                          groupIds: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'The ID(s) of the group(s) obtained from the remote resource that this private endpoint should connect to.'
                          },
                          requestMessage: {
                            type: 'string',
                            description: 'A message passed to the owner of the remote resource with this connection request. Restricted to 140 chars.'
                          },
                          privateLinkServiceConnectionState: {
                            description: 'A collection of read-only information about the state of the connection to the remote resource.',
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
                          }
                        }
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
                        items: { type: 'string' },
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
                        properties: {
                          groupId: {
                            type: 'string',
                            description: 'The ID of a group obtained from the remote resource that this private endpoint should connect to.'
                          },
                          memberName: {
                            type: 'string',
                            description: 'The member name of a group obtained from the remote resource that this private endpoint should connect to.'
                          },
                          privateIPAddress: {
                            type: 'string',
                            description: "A private ip address obtained from the private endpoint's subnet."
                          }
                        }
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
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/applicationGateway.json).
