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
                            description: 'A list of ip configurations of the container network interface configuration.'
                          },
                          containerNetworkInterfaces: {
                            type: 'array',
                            items: {
                              properties: { id: [Object] },
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
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the IP configuration profile.',
                          properties: {
                            subnet: {
                              description: 'The reference to the subnet resource to create a container network interface ip configuration.',
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ]
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
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/networkProfile.json).
