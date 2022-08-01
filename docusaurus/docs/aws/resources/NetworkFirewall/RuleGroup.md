---
id: RuleGroup
title: Rule Group
---

Provides a [Network Firewall Policy](https://console.aws.amazon.com/vpc/home?#NetworkFirewallRuleGroups:)

### Sample Code

#### Stateful rule

```js
exports.createResources = () => [
  {
    type: "RuleGroup",
    group: "NetworkFirewall",
    properties: ({}) => ({
      RuleGroup: {
        RuleVariables: {
          IPSets: {
            HOME_NET: {
              Definition: ["10.11.0.0/16", "10.12.0.0/16"],
            },
          },
        },
        RulesSource: {
          RulesSourceList: {
            GeneratedRulesType: "DENYLIST",
            TargetTypes: ["HTTP_HOST", "TLS_SNI"],
            Targets: [".twitter.com", ".facebook.com"],
          },
        },
      },
      Capacity: 100,
      RuleGroupName: "block-domains",
      Type: "STATEFUL",
    }),
  },
];
```

#### Stateless rule

```js
exports.createResources = () => [
  {
    type: "RuleGroup",
    group: "NetworkFirewall",
    properties: ({}) => ({
      RuleGroup: {
        RulesSource: {
          StatelessRulesAndCustomActions: {
            StatelessRules: [
              {
                Priority: 1,
                RuleDefinition: {
                  Actions: ["aws:drop"],
                  MatchAttributes: {
                    Destinations: [
                      {
                        AddressDefinition: "0.0.0.0/0",
                      },
                    ],
                    Protocols: [1],
                    Sources: [
                      {
                        AddressDefinition: "0.0.0.0/0",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      Capacity: 1,
      RuleGroupName: "drop-icmp",
      Type: "STATELESS",
    }),
  },
];
```

### Examples

- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateRuleGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-network-firewall/interfaces/createrulegroupcommandinput.html)

### Used By

- [Firewall Policy](./Policy.md)

### List

```sh
gc l -t NetworkFirewall::RuleGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 3 NetworkFirewall::RuleGroup from aws                                              │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: block-domains                                                                │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   RuleGroup:                                                                       │
│     RuleVariables:                                                                 │
│       IPSets:                                                                      │
│         HOME_NET:                                                                  │
│           Definition:                                                              │
│             - "10.11.0.0/16"                                                       │
│             - "10.12.0.0/16"                                                       │
│     RulesSource:                                                                   │
│       RulesSourceList:                                                             │
│         GeneratedRulesType: DENYLIST                                               │
│         TargetTypes:                                                               │
│           - "HTTP_HOST"                                                            │
│           - "TLS_SNI"                                                              │
│         Targets:                                                                   │
│           - ".twitter.com"                                                         │
│           - ".facebook.com"                                                        │
│   Capacity: 100                                                                    │
│   ConsumedCapacity: 5                                                              │
│   EncryptionConfiguration:                                                         │
│     KeyId: AWS_OWNED_KMS_KEY                                                       │
│     Type: AWS_OWNED_KMS_KEY                                                        │
│   LastModifiedTime: 2022-05-03T22:37:27.432Z                                       │
│   NumberOfAssociations: 1                                                          │
│   RuleGroupArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegrou… │
│   RuleGroupId: 9089adc6-4ac7-47cb-bd3d-4ed633d1b4c9                                │
│   RuleGroupName: block-domains                                                     │
│   RuleGroupStatus: ACTIVE                                                          │
│   Tags: []                                                                         │
│   Type: STATEFUL                                                                   │
│                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: drop-icmp                                                                    │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   RuleGroup:                                                                       │
│     RulesSource:                                                                   │
│       StatelessRulesAndCustomActions:                                              │
│         StatelessRules:                                                            │
│           - Priority: 1                                                            │
│             RuleDefinition:                                                        │
│               Actions:                                                             │
│                 - "aws:drop"                                                       │
│               MatchAttributes:                                                     │
│                 Destinations:                                                      │
│                   - AddressDefinition: 0.0.0.0/0                                   │
│                 Protocols:                                                         │
│                   - 1                                                              │
│                 Sources:                                                           │
│                   - AddressDefinition: 0.0.0.0/0                                   │
│   Capacity: 1                                                                      │
│   ConsumedCapacity: 1                                                              │
│   EncryptionConfiguration:                                                         │
│     KeyId: AWS_OWNED_KMS_KEY                                                       │
│     Type: AWS_OWNED_KMS_KEY                                                        │
│   LastModifiedTime: 2022-05-03T22:37:27.015Z                                       │
│   NumberOfAssociations: 1                                                          │
│   RuleGroupArn: arn:aws:network-firewall:us-east-1:840541460064:stateless-rulegro… │
│   RuleGroupId: 17fc6274-f2b3-40cf-963b-f9636534ee8e                                │
│   RuleGroupName: drop-icmp                                                         │
│   RuleGroupStatus: ACTIVE                                                          │
│   Tags: []                                                                         │
│   Type: STATELESS                                                                  │
│                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: drop-ssh-between-spokes                                                      │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   RuleGroup:                                                                       │
│     RuleVariables:                                                                 │
│       IPSets:                                                                      │
│         SPOKE_VPCS:                                                                │
│           Definition:                                                              │
│             - "10.11.0.0/16"                                                       │
│             - "10.12.0.0/16"                                                       │
│     RulesSource:                                                                   │
│       RulesString:       drop tcp $SPOKE_VPCS any <> $SPOKE_VPCS 22 (msg:"Blocked… │
│                                                                                    │
│   Capacity: 100                                                                    │
│   ConsumedCapacity: 1                                                              │
│   EncryptionConfiguration:                                                         │
│     KeyId: AWS_OWNED_KMS_KEY                                                       │
│     Type: AWS_OWNED_KMS_KEY                                                        │
│   LastModifiedTime: 2022-05-03T22:37:28.684Z                                       │
│   NumberOfAssociations: 1                                                          │
│   RuleGroupArn: arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegrou… │
│   RuleGroupId: 882cb665-5bb9-4aa7-bdc4-49c10deac13e                                │
│   RuleGroupName: drop-ssh-between-spokes                                           │
│   RuleGroupStatus: ACTIVE                                                          │
│   Tags: []                                                                         │
│   Type: STATEFUL                                                                   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├────────────────────────────┬──────────────────────────────────────────────────────┤
│ NetworkFirewall::RuleGroup │ block-domains                                        │
│                            │ drop-icmp                                            │
│                            │ drop-ssh-between-spokes                              │
└────────────────────────────┴──────────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t RuleGroup" executed in 12s, 114 MB
```
