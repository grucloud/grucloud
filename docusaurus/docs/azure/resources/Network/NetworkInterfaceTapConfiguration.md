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
                    properties: [Circular *1],
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
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                },
                destinationNetworkInterfaceIPConfiguration: {
                  description: 'The reference to the private IP Address of the collector nic that will receive the tap.',
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
