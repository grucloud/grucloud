---
id: WebApplicationFirewallPolicy
title: WebApplicationFirewallPolicy
---
Provides a **WebApplicationFirewallPolicy** from the **Network** group
## Examples
### Creates or updates a WAF policy within a resource group
```js
provider.Network.makeWebApplicationFirewallPolicy({
  name: "myWebApplicationFirewallPolicy",
  properties: () => ({
    location: "WestUs",
    properties: {
      managedRules: {
        managedRuleSets: [{ ruleSetType: "OWASP", ruleSetVersion: "3.2" }],
        exclusions: [
          {
            matchVariable: "RequestArgNames",
            selectorMatchOperator: "StartsWith",
            selector: "hello",
            exclusionManagedRuleSets: [
              {
                ruleSetType: "OWASP",
                ruleSetVersion: "3.2",
                ruleGroups: [
                  {
                    ruleGroupName: "REQUEST-930-APPLICATION-ATTACK-LFI",
                    rules: [{ ruleId: "930120" }],
                  },
                  { ruleGroupName: "REQUEST-932-APPLICATION-ATTACK-RCE" },
                ],
              },
            ],
          },
          {
            matchVariable: "RequestArgNames",
            selectorMatchOperator: "EndsWith",
            selector: "hello",
            exclusionManagedRuleSets: [
              { ruleSetType: "OWASP", ruleSetVersion: "3.1", ruleGroups: [] },
            ],
          },
          {
            matchVariable: "RequestArgNames",
            selectorMatchOperator: "StartsWith",
            selector: "test",
          },
          {
            matchVariable: "RequestArgValues",
            selectorMatchOperator: "StartsWith",
            selector: "test",
          },
        ],
      },
      customRules: [
        {
          name: "Rule1",
          priority: 1,
          ruleType: "MatchRule",
          action: "Block",
          matchConditions: [
            {
              matchVariables: [{ variableName: "RemoteAddr", selector: null }],
              operator: "IPMatch",
              matchValues: ["192.168.1.0/24", "10.0.0.0/24"],
            },
          ],
        },
        {
          name: "Rule2",
          priority: 2,
          ruleType: "MatchRule",
          matchConditions: [
            {
              matchVariables: [{ variableName: "RemoteAddr", selector: null }],
              operator: "IPMatch",
              matchValues: ["192.168.1.0/24"],
            },
            {
              matchVariables: [
                { variableName: "RequestHeaders", selector: "UserAgent" },
              ],
              operator: "Contains",
              matchValues: ["Windows"],
            },
          ],
          action: "Block",
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
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/webapplicationfirewall.json).
