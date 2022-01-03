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
    networkInterface: resources.Network.NetworkInterface["myNetworkInterface"],
    loadBalancer: resources.Network.LoadBalancer["myLoadBalancer"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
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
- [NetworkInterface](../Network/NetworkInterface.md)
- [LoadBalancer](../Network/LoadBalancer.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [Configuration](../DBforPostgreSQL/Configuration.md)
- [LoadBalancerBackendAddressPool](../Network/LoadBalancerBackendAddressPool.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkInterface.json).
