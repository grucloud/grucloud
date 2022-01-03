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
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
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
- [Configuration](../DBforPostgreSQL/Configuration.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [LoadBalancerBackendAddressPool](../Network/LoadBalancerBackendAddressPool.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/loadBalancer.json).
