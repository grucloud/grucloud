---
id: DscpConfiguration
title: DscpConfiguration
---
Provides a **DscpConfiguration** from the **Network** group
## Examples
### Create DSCP Configuration
```js
provider.Network.makeDscpConfiguration({
  name: "myDscpConfiguration",
  properties: () => ({
    properties: {
      qosDefinitionCollection: [
        {
          markings: [1],
          sourceIpRanges: [{ startIP: "127.0.0.1", endIP: "127.0.0.2" }],
          destinationIpRanges: [{ startIP: "127.0.10.1", endIP: "127.0.10.2" }],
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [NatGateway](../Network/NatGateway.md)
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
                    properties: { id: [Object] },
                    'x-ms-azure-resource': true
                  },
                  networkSecurityGroup: {
                    description: 'The reference to the NetworkSecurityGroup resource.',
                    properties: { properties: [Object], etag: [Object] },
                    allOf: [ [Object] ]
                  },
                  privateEndpoint: {
                    properties: {
                      extendedLocation: [Object],
                      properties: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Private endpoint resource.',
                    readOnly: true
                  },
                  ipConfigurations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'IPConfiguration in a network interface.'
                    },
                    description: 'A list of IPConfigurations of the network interface.'
                  },
                  tapConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Tap configuration in a Network Interface.'
                    },
                    description: 'A list of TapConfigurations of the network interface.'
                  },
                  dnsSettings: {
                    description: 'The DNS settings in network interface.',
                    properties: {
                      dnsServers: [Object],
                      appliedDnsServers: [Object],
                      internalDnsNameLabel: [Object],
                      internalFqdn: [Object],
                      internalDomainNameSuffix: [Object]
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
                    description: 'If the network interface is accelerated networking enabled.'
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
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: true
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
                      extendedLocation: [Object],
                      properties: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ]
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
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/dscpConfiguration.json).
