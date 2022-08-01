---
id: NetworkFirewall
title: Network Firewall
---

Provides a [Network Firewall](https://console.aws.amazon.com/vpc/home?#NetworkFirewalls:)

```js
exports.createResources = () => [
  {
    type: "Firewall",
    group: "NetworkFirewall",
    properties: ({}) => ({
      DeleteProtection: false,
      FirewallName: "NetworkFirewall",
      FirewallPolicyChangeProtection: false,
      SubnetChangeProtection: false,
    }),
    dependencies: () => ({
      vpc: "inspection-vpc",
      subnets: [
        "inspection-vpc-private-subnet-a",
        "inspection-vpc-private-subnet-b",
        "inspection-vpc-private-subnet-c",
      ],
      firewallPolicy: "firewall-policy",
    }),
  },
];
```

### Examples

- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateFirewallCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-network-firewall/interfaces/createfirewallcommandinput.html)

### Dependencies

- [Vpc](../EC2/Vpc.md)
- [Subnet](../EC2/Subnet.md)
- [Firewall Policy](./Policy.md)

### Used By

- [Logging Configuration](./LoggingConfiguration.md)

### List

```sh
gc l -t Firewall
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkFirewall::Firewall from aws                                               │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: NetworkFirewall                                                              │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   DeleteProtection: false                                                          │
│   EncryptionConfiguration:                                                         │
│     KeyId: AWS_OWNED_KMS_KEY                                                       │
│     Type: AWS_OWNED_KMS_KEY                                                        │
│   FirewallArn: arn:aws:network-firewall:us-east-1:840541460064:firewall/NetworkFi… │
│   FirewallId: 6587ce6b-02f2-4416-8d44-cdfb5e165e9e                                 │
│   FirewallName: NetworkFirewall                                                    │
│   FirewallPolicyArn: arn:aws:network-firewall:us-east-1:840541460064:firewall-pol… │
│   FirewallPolicyChangeProtection: false                                            │
│   SubnetChangeProtection: false                                                    │
│   SubnetMappings:                                                                  │
│     - SubnetId: subnet-0339dd3e4787f3a36                                           │
│     - SubnetId: subnet-065b1de258bfae082                                           │
│     - SubnetId: subnet-0f5e07842fa201ddb                                           │
│   Tags: []                                                                         │
│   VpcId: vpc-021c0573712bc7d11                                                     │
│   FirewallStatus:                                                                  │
│     ConfigurationSyncStateSummary: IN_SYNC                                         │
│     Status: READY                                                                  │
│     SyncStates:                                                                    │
│       us-east-1a:                                                                  │
│         Attachment:                                                                │
│           EndpointId: vpce-04b4027d3d0ecb51d                                       │
│           Status: READY                                                            │
│           SubnetId: subnet-0339dd3e4787f3a36                                       │
│         Config:                                                                    │
│           arn:aws:network-firewall:us-east-1:840541460064:firewall-policy/firewal… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: e29b2c57-c7a2-4856-81fc-23d0d2f89ec7                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/bloc… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: 9361a827-c2a9-47a9-9b60-c1a56a9cc94a                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/drop… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: f26cf1c0-f00b-44e0-9bb9-7643d702361f                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateless-rulegroup/dro… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: 498c287a-8d54-497d-ab88-f04477acc5f5                      │
│       us-east-1b:                                                                  │
│         Attachment:                                                                │
│           EndpointId: vpce-03974c3f6d7f02033                                       │
│           Status: READY                                                            │
│           SubnetId: subnet-065b1de258bfae082                                       │
│         Config:                                                                    │
│           arn:aws:network-firewall:us-east-1:840541460064:firewall-policy/firewal… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: e29b2c57-c7a2-4856-81fc-23d0d2f89ec7                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/bloc… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: 9361a827-c2a9-47a9-9b60-c1a56a9cc94a                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/drop… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: f26cf1c0-f00b-44e0-9bb9-7643d702361f                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateless-rulegroup/dro… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: 498c287a-8d54-497d-ab88-f04477acc5f5                      │
│       us-east-1c:                                                                  │
│         Attachment:                                                                │
│           EndpointId: vpce-0fb257c522a1f8554                                       │
│           Status: READY                                                            │
│           SubnetId: subnet-0f5e07842fa201ddb                                       │
│         Config:                                                                    │
│           arn:aws:network-firewall:us-east-1:840541460064:firewall-policy/firewal… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: e29b2c57-c7a2-4856-81fc-23d0d2f89ec7                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/bloc… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: 9361a827-c2a9-47a9-9b60-c1a56a9cc94a                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/drop… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: f26cf1c0-f00b-44e0-9bb9-7643d702361f                      │
│           arn:aws:network-firewall:us-east-1:840541460064:stateless-rulegroup/dro… │
│             SyncStatus: IN_SYNC                                                    │
│             UpdateToken: 498c287a-8d54-497d-ab88-f04477acc5f5                      │
│   UpdateToken: eb295f8f-b321-4794-a36e-944bb9e2ab10                                │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├───────────────────────────┬───────────────────────────────────────────────────────┤
│ NetworkFirewall::Firewall │ NetworkFirewall                                       │
└───────────────────────────┴───────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Firewall" executed in 8s, 194 MB
```
