---
id: FirewallPolicyRuleGroup
title: FirewallPolicyRuleGroup
---
Provides a **FirewallPolicyRuleGroup** from the **Network** group
## Examples
### Create FirewallPolicyRuleGroup
```js
provider.Network.makeFirewallPolicyRuleGroup({
  name: "myFirewallPolicyRuleGroup",
  properties: () => ({
    properties: {
      priority: 110,
      rules: [
        {
          ruleType: "FirewallPolicyFilterRule",
          name: "Example-Filter-Rule",
          action: { type: "Deny" },
          ruleConditions: [
            {
              ruleConditionType: "NetworkRuleCondition",
              name: "network-condition1",
              sourceAddresses: ["10.1.25.0/24"],
              destinationAddresses: ["*"],
              ipProtocols: ["TCP"],
              destinationPorts: ["*"],
            },
          ],
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create FirewallPolicyRuleGroup With IpGroups
```js
provider.Network.makeFirewallPolicyRuleGroup({
  name: "myFirewallPolicyRuleGroup",
  properties: () => ({
    properties: {
      priority: 110,
      rules: [
        {
          ruleType: "FirewallPolicyFilterRule",
          name: "Example-Filter-Rule",
          action: { type: "Deny" },
          ruleConditions: [
            {
              ruleConditionType: "NetworkRuleCondition",
              name: "network-condition1",
              ipProtocols: ["TCP"],
              destinationPorts: ["*"],
              sourceIpGroups: [
                "/subscriptions/subid/providers/Microsoft.Network/resourceGroup/rg1/ipGroups/ipGroups1",
              ],
              destinationIpGroups: [
                "/subscriptions/subid/providers/Microsoft.Network/resourceGroup/rg1/ipGroups/ipGroups2",
              ],
            },
          ],
        },
      ],
    },
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
The resource version is `2020-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2020-04-01/firewallPolicy.json).
