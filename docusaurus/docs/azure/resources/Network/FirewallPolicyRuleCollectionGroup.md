---
id: FirewallPolicyRuleCollectionGroup
title: FirewallPolicyRuleCollectionGroup
---
Provides a **FirewallPolicyRuleCollectionGroup** from the **Network** group
## Examples
### Create FirewallPolicyRuleCollectionGroup
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 100,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyFilterRuleCollection",
          name: "Example-Filter-Rule-Collection",
          priority: 100,
          action: { type: "Deny" },
          rules: [
            {
              ruleType: "NetworkRule",
              name: "network-rule1",
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

### Create FirewallPolicyRuleCollectionGroup With IpGroups
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 110,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyFilterRuleCollection",
          name: "Example-Filter-Rule-Collection",
          action: { type: "Deny" },
          rules: [
            {
              ruleType: "NetworkRule",
              name: "network-1",
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

### Create FirewallPolicyNatRuleCollectionGroup
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 100,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyNatRuleCollection",
          priority: 100,
          name: "Example-Nat-Rule-Collection",
          action: { type: "DNAT" },
          rules: [
            {
              ruleType: "NatRule",
              name: "nat-rule1",
              translatedFqdn: "internalhttp.server.net",
              translatedPort: "8080",
              ipProtocols: ["TCP", "UDP"],
              sourceAddresses: ["2.2.2.2"],
              sourceIpGroups: [],
              destinationAddresses: ["152.23.32.23"],
              destinationPorts: ["8080"],
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

### Create FirewallPolicyRuleCollectionGroup With Web Categories
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 110,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyFilterRuleCollection",
          name: "Example-Filter-Rule-Collection",
          action: { type: "Deny" },
          rules: [
            {
              ruleType: "ApplicationRule",
              name: "rule1",
              description: "Deny inbound rule",
              protocols: [{ protocolType: "Https", port: 443 }],
              sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              webCategories: ["Hacking"],
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
      description: 'The properties of the firewall policy rule collection group.',
      properties: {
        priority: {
          type: 'integer',
          format: 'int32',
          maximum: 65000,
          exclusiveMaximum: false,
          minimum: 100,
          exclusiveMinimum: false,
          description: 'Priority of the Firewall Policy Rule Collection Group resource.'
        },
        ruleCollections: {
          type: 'array',
          items: {
            description: 'Properties of the rule collection.',
            discriminator: 'ruleCollectionType',
            required: [ 'ruleCollectionType' ],
            properties: {
              ruleCollectionType: {
                type: 'string',
                description: 'The type of the rule collection.',
                enum: [
                  'FirewallPolicyNatRuleCollection',
                  'FirewallPolicyFilterRuleCollection'
                ],
                'x-ms-enum': {
                  name: 'FirewallPolicyRuleCollectionType',
                  modelAsString: true
                }
              },
              name: {
                type: 'string',
                description: 'The name of the rule collection.'
              },
              priority: {
                type: 'integer',
                format: 'int32',
                maximum: 65000,
                exclusiveMaximum: false,
                minimum: 100,
                exclusiveMinimum: false,
                description: 'Priority of the Firewall Policy Rule Collection resource.'
              }
            }
          },
          description: 'Group of Firewall Policy rule collections.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the firewall policy rule collection group resource.',
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
  description: 'Rule Collection Group resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/firewallPolicy.json).
