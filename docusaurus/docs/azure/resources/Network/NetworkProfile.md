---
id: NetworkProfile
title: NetworkProfile
---
Provides a **NetworkProfile** from the **Network** group
## Examples
### Create network profile defaults
```js
exports.createResources = () => [
  {
    type: "NetworkProfile",
    group: "Network",
    name: "myNetworkProfile",
    properties: () => ({
      location: "westus",
      properties: {
        containerNetworkInterfaceConfigurations: [
          {
            name: "eth1",
            properties: {
              ipConfigurations: [
                {
                  name: "ipconfig1",
                  properties: {
                    subnet: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/networkProfileVnet/subnets/networkProfileSubnet1",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      networkInterfaces: ["myNetworkInterface"],
      virtualHubIpConfigurations: ["myVirtualHubIpConfiguration"],
      subnets: ["mySubnet"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NetworkInterface](../Network/NetworkInterface.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
- [Subnet](../Network/Subnet.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Network profile properties.',
      properties: {
        containerNetworkInterfaces: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Container network interface properties.',
                properties: {
                  containerNetworkInterfaceConfiguration: {
                    readOnly: true,
                    description: 'Container network interface configuration from which this container network interface is created.',
                    properties: {
                      properties: {
                        'x-ms-client-flatten': true,
                        description: 'Container network interface configuration properties.',
                        properties: {
                          ipConfigurations: {
                            type: 'array',
                            items: <ref *1> {
                              properties: {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the IP configuration profile.',
                                  properties: {
                                    subnet: {
                                      description: 'The reference to the subnet resource to create a container network interface ip configuration.',
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
                                              items: [Circular *1],
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
                            description: 'A list of ip configurations of the container network interface configuration.'
                          },
                          containerNetworkInterfaces: {
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
                            description: 'A list of container network interfaces created from this container network interface configuration.'
                          },
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the container network interface configuration resource.',
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
                    ]
                  },
                  container: {
                    description: 'Reference to the container to which this container network interface is attached.',
                    properties: {},
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
                  ipConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the container network interface IP configuration.',
                          properties: {
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the container network interface IP configuration resource.',
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
                      description: 'The ip configuration for a container network interface.'
                    },
                    description: 'Reference to the ip configuration on this container nic.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the container network interface resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Container network interface child resource.'
          },
          description: 'List of child container network interfaces.'
        },
        containerNetworkInterfaceConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Container network interface configuration properties.',
                properties: {
                  ipConfigurations: {
                    type: 'array',
                    items: <ref *1> {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the IP configuration profile.',
                          properties: {
                            subnet: {
                              description: 'The reference to the subnet resource to create a container network interface ip configuration.',
                              properties: <ref *2> {
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
                                              items: {
                                                properties: {
                                                  extendedLocation: [Object],
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'A network interface in a resource group.'
                                              },
                                              description: 'A collection of references to network interfaces.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: [Circular *2],
                                                allOf: [ [Object] ],
                                                description: 'Subnet in a virtual network resource.'
                                              },
                                              description: 'A collection of references to subnets.'
                                            },
                                            flowLogs: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
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
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Route resource.'
                                              },
                                              description: 'Collection of routes contained within a route table.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: [Circular *2],
                                                allOf: [ [Object] ],
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
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'Service Endpoint policy definitions.'
                                                },
                                                description: 'A collection of service endpoint policy definitions of the service endpoint policy.'
                                              },
                                              subnets: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Circular *2],
                                                  allOf: [Array],
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
                                                properties: [Circular *2],
                                                allOf: [ [Object] ]
                                              },
                                              networkInterfaces: {
                                                type: 'array',
                                                readOnly: true,
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
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
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'PrivateLinkServiceConnection resource.'
                                                },
                                                description: 'A grouping of information about the connection to the remote resource.'
                                              },
                                              manualPrivateLinkServiceConnections: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'PrivateLinkServiceConnection resource.'
                                                },
                                                description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                                              },
                                              customDnsConfigs: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Contains custom Dns resolution configuration from customer.'
                                                },
                                                description: 'An array of custom dns configurations.'
                                              },
                                              applicationSecurityGroups: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'An application security group in a resource group.'
                                                },
                                                description: 'Application security groups in which the private endpoint IP configuration is included.'
                                              },
                                              ipConfigurations: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  properties: [Object],
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
                                                properties: [Circular *2],
                                                allOf: [ [Object] ]
                                              },
                                              publicIPAddress: {
                                                description: 'The reference to the public IP resource.',
                                                properties: {
                                                  extendedLocation: [Object],
                                                  sku: [Object],
                                                  properties: [Object],
                                                  etag: [Object],
                                                  zones: [Object]
                                                },
                                                allOf: [ [Object] ]
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
                                      items: [Circular *1],
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
                                                properties: { id: [Object] },
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
                    description: 'A list of ip configurations of the container network interface configuration.'
                  },
                  containerNetworkInterfaces: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'A list of container network interfaces created from this container network interface configuration.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the container network interface configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Container network interface configuration child resource.'
          },
          description: 'List of chid container network interface configurations.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the network profile resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the network profile resource.',
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
  description: 'Network profile resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/networkProfile.json).
