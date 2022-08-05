---
id: NetworkFirewallPolicy
title: Policy
---

Provides a [Network Firewall Policy](https://console.aws.amazon.com/vpc/home?#NetworkFirewallPolicies:)

```js
exports.createResources = () => [
  {
    type: "Policy",
    group: "NetworkFirewall",
    properties: ({ getId }) => ({
      FirewallPolicy: {
        StatefulRuleGroupReferences: [
          {
            ResourceArn: `${getId({
              type: "RuleGroup",
              group: "NetworkFirewall",
              name: "drop-ssh-between-spokes",
            })}`,
          },
          {
            ResourceArn: `${getId({
              type: "RuleGroup",
              group: "NetworkFirewall",
              name: "block-domains",
            })}`,
          },
        ],
        StatelessDefaultActions: ["aws:forward_to_sfe"],
        StatelessFragmentDefaultActions: ["aws:forward_to_sfe"],
        StatelessRuleGroupReferences: [
          {
            Priority: 20,
            ResourceArn: `${getId({
              type: "RuleGroup",
              group: "NetworkFirewall",
              name: "drop-icmp",
            })}`,
          },
        ],
      },
      FirewallPolicyName: "firewall-policy",
    }),
    dependencies: () => ({
      ruleGroups: ["block-domains", "drop-icmp", "drop-ssh-between-spokes"],
    }),
  },
];
```

### Examples

- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateFirewallPolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-network-firewall/interfaces/createfirewallpolicycommandinput.html)

### Dependencies

- [RuleGroup](./RuleGroup.md)

### Used By

- [Firewall](./Firewall.md)

### List

```sh
gc l -t NetworkFirewall::Policy
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkFirewall::Policy from aws                                                 │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: firewall-policy                                                              │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   FirewallPolicy:                                                                  │
│     StatefulRuleGroupReferences:                                                   │
│       -                                                                            │
│         ResourceArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rul… │
│       -                                                                            │
│         ResourceArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rul… │
│     StatelessDefaultActions:                                                       │
│       - "aws:forward_to_sfe"                                                       │
│     StatelessFragmentDefaultActions:                                               │
│       - "aws:forward_to_sfe"                                                       │
│     StatelessRuleGroupReferences:                                                  │
│       - Priority: 20                                                               │
│         ResourceArn: arn:aws:network-firewall:us-east-1:840541460064:stateless-ru… │
│   ConsumedStatefulRuleCapacity: 200                                                │
│   ConsumedStatelessRuleCapacity: 1                                                 │
│   EncryptionConfiguration:                                                         │
│     KeyId: AWS_OWNED_KMS_KEY                                                       │
│     Type: AWS_OWNED_KMS_KEY                                                        │
│   FirewallPolicyArn: arn:aws:network-firewall:us-east-1:840541460064:firewall-pol… │
│   FirewallPolicyId: ed6eb3ad-c102-48ff-abde-1381eb0ac7c6                           │
│   FirewallPolicyName: firewall-policy                                              │
│   FirewallPolicyStatus: ACTIVE                                                     │
│   LastModifiedTime: 2022-05-03T22:37:29.883Z                                       │
│   NumberOfAssociations: 1                                                          │
│   Tags: []                                                                         │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├─────────────────────────┬─────────────────────────────────────────────────────────┤
│ NetworkFirewall::Policy │ firewall-policy                                         │
└─────────────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkFirewall::Policy" executed in 7s, 171 MB
```
