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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    firewallPolicy: "myFirewallPolicy",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    firewallPolicy: "myFirewallPolicy",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the firewall policy rule group.',
      properties: {
        priority: {
          type: 'integer',
          format: 'int32',
          maximum: 65000,
          exclusiveMaximum: false,
          minimum: 100,
          exclusiveMinimum: false,
          description: 'Priority of the Firewall Policy Rule Group resource.'
        },
        rules: {
          type: 'array',
          items: {
            description: 'Properties of the rule.',
            discriminator: 'ruleType',
            required: [ 'ruleType' ],
            properties: {
              ruleType: {
                type: 'string',
                description: 'The type of the rule.',
                enum: [ 'FirewallPolicyNatRule', 'FirewallPolicyFilterRule' ],
                'x-ms-enum': { name: 'FirewallPolicyRuleType', modelAsString: true }
              },
              name: { type: 'string', description: 'The name of the rule.' },
              priority: {
                type: 'integer',
                format: 'int32',
                maximum: 65000,
                exclusiveMaximum: false,
                minimum: 100,
                exclusiveMinimum: false,
                description: 'Priority of the Firewall Policy Rule resource.'
              }
            }
          },
          description: 'Group of Firewall Policy rules.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the firewall policy rule group resource.',
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
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { type: 'string', readOnly: true, description: 'Rule Group type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Rule Group resource.'
}
```
## Misc
The resource version is `2020-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2020-04-01/firewallPolicy.json).
