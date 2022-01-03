---
id: FirewallPolicyIdpsSignaturesOverride
title: FirewallPolicyIdpsSignaturesOverride
---
Provides a **FirewallPolicyIdpsSignaturesOverride** from the **Network** group
## Examples
### put signature overrides
```js
provider.Network.makeFirewallPolicyIdpsSignaturesOverride({
  name: "myFirewallPolicyIdpsSignaturesOverride",
  properties: () => ({
    id: "/subscriptions/e747cc13-97d4-4a79-b463-42d7f4e558f2/resourceGroups/rg1/providers/Microsoft.Network/firewallPolicies/firewallPolicy/signatureOverrides/default",
    name: "default",
    type: "Microsoft.Network/firewallPolicies/signatureOverrides",
    properties: { signatures: { 2000105: "Off", 2000106: "Deny" } },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/firewallPolicy.json).
