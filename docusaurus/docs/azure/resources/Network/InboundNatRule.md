---
id: InboundNatRule
title: InboundNatRule
---
Provides a **InboundNatRule** from the **Network** group
## Examples
### InboundNatRuleCreate
```js
provider.Network.makeInboundNatRule({
  name: "myInboundNatRule",
  properties: () => ({
    properties: {
      protocol: "Tcp",
      frontendIPConfiguration: {
        id: "/subscriptions/subid/resourceGroups/testrg/providers/Microsoft.Network/loadBalancers/lb1/frontendIPConfigurations/ip1",
      },
      frontendPort: 3390,
      backendPort: 3389,
      idleTimeoutInMinutes: 4,
      enableTcpReset: false,
      enableFloatingIP: false,
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
## Swagger Schema
```js
<ref *1> {
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of load balancer inbound NAT rule.',
      properties: {
        frontendIPConfiguration: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        backendIPConfiguration: {
          properties: {
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
                    properties: { properties: [Object], etag: [Object] },
                    allOf: [ [Object] ],
                    description: 'Virtual Network Tap resource.'
                  },
                  description: 'The reference to Virtual Network Taps.'
                },
                applicationGatewayBackendAddressPools: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      etag: [Object],
                      type: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Backend Address Pool of an application gateway.'
                  },
                  description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                },
                loadBalancerBackendAddressPools: {
                  type: 'array',
                  items: {
                    properties: {
                      properties: [Object],
                      name: [Object],
                      etag: [Object],
                      type: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Pool of backend IP addresses.'
                  },
                  description: 'The reference to LoadBalancerBackendAddressPool resource.'
                },
                loadBalancerInboundNatRules: {
                  type: 'array',
                  items: [Circular *1],
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
                    type: { type: 'string', description: 'Resource type.' }
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
                  description: 'Whether this is a primary customer address on the network interface.'
                },
                publicIPAddress: {
                  description: 'Public IP address bound to the IP configuration.',
                  properties: {
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
                applicationSecurityGroups: {
                  type: 'array',
                  items: {
                    properties: { properties: [Object], etag: [Object] },
                    allOf: [ [Object] ],
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
                      items: [Object],
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
          description: 'IPConfiguration in a network interface.',
          readOnly: true
        },
        protocol: {
          description: 'The reference to the transport protocol used by the load balancing rule.',
          type: 'string',
          enum: [ 'Udp', 'Tcp', 'All' ],
          'x-ms-enum': { name: 'TransportProtocol', modelAsString: true }
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
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the inbound NAT rule resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Inbound NAT rule of the load balancer.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/loadBalancer.json).
