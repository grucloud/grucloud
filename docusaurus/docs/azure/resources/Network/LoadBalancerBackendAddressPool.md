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
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [Subnet](../Network/Subnet.md)
- [NetworkInterface](../Network/NetworkInterface.md)
- [LoadBalancer](../Network/LoadBalancer.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
## Swagger Schema
```js
<ref *1> {
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
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  subnet: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  ipAddress: {
                    type: 'string',
                    description: 'IP Address belonging to the referenced virtual network.',
                    'x-ms-azure-resource': false
                  },
                  networkInterfaceIPConfiguration: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: true
                  },
                  loadBalancerFrontendIPConfiguration: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: false
                  },
                  inboundNatRulesPortMapping: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: [Object],
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
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Network interface IP configuration properties.',
                properties: {
                  gatewayLoadBalancer: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
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
                    items: [Circular *1],
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
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
