---
id: VirtualNetworkTap
title: VirtualNetworkTap
---
Provides a **VirtualNetworkTap** from the **Network** group
## Examples
### Create Virtual Network Tap
```js
provider.Network.makeVirtualNetworkTap({
  name: "myVirtualNetworkTap",
  properties: () => ({
    properties: {
      destinationNetworkInterfaceIPConfiguration: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/testNetworkInterface/ipConfigurations/ipconfig1",
      },
    },
    location: "centraluseuap",
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
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkTap.json).
