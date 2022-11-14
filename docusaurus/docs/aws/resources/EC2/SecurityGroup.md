---
id: SecurityGroup
title: Security Group
---

Create a security group, used to restrict network access to the EC2 instances.

Add new ingress and egress rules with [SecurityGroupRuleIngress](./SecurityGroupRuleIngress) and [SecurityGroupRuleEgress](./SecurityGroupRuleEgress)

```js
exports.createResources = () => [
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "EcsSecurityGroup"
      Description: "Managed By GruCloud",
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
];
```

### Examples

- [ec2-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/Instance/ec2-vpc)

### Properties

- [AuthorizeSecurityGroupIngressCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/authorizesecuritygroupingresscommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)

### Used By

- [Batch Compute Environment](../Batch/ComputeEnvironment.md)
- [EC2 Client Vpn Endpoint](../EC2/ClientVpnEndpoint.md)
- [EC2 Instance](./Instance.md)
- [EC2 SecurityGroup Rule Ingress](./SecurityGroupRuleIngress.md)
- [EC2 SecurityGroup Rule Egress](./SecurityGroupRuleEgress.md)
- [ECS Service](../ECS/Service.md)
- [ElastiCache Cluster](../ElastiCache/Cluster.md)
- [EMRServerless Application](../EMRServerless/Application.md)
- [MQ Broker](../MQ/Broker.md)
- [MSK Cluster V2](../MSK/ClusterV2.md)

### List

```sh
gc l -t EC2::SecurityGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 4 EC2::SecurityGroup from aws                                                            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpc-default::default                                                           │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   Description: default VPC security group                                                │
│   GroupName: default                                                                     │
│   IpPermissions: []                                                                      │
│   OwnerId: 840541460064                                                                  │
│   GroupId: sg-4e82a670                                                                   │
│   IpPermissionsEgress: []                                                                │
│   Tags:                                                                                  │
│     - Key: sg-rule-egress-test::namespace                                                │
│       Value:                                                                             │
│     - Key: sg-rule-ingress-test::namespace                                               │
│       Value:                                                                             │
│   VpcId: vpc-faff3987                                                                    │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::default                                                        │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   Description: default VPC security group                                                │
│   GroupName: default                                                                     │
│   IpPermissions:                                                                         │
│     -                                                                                    │
│       IpProtocol: -1                                                                     │
│       IpRanges: []                                                                       │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       UserIdGroupPairs:                                                                  │
│         -                                                                                │
│           GroupId: sg-0807ac732d3e193d3                                                  │
│           UserId: 840541460064                                                           │
│   OwnerId: 840541460064                                                                  │
│   GroupId: sg-0807ac732d3e193d3                                                          │
│   IpPermissionsEgress:                                                                   │
│     -                                                                                    │
│       IpProtocol: -1                                                                     │
│       IpRanges:                                                                          │
│         - CidrIp: 0.0.0.0/0                                                              │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       UserIdGroupPairs: []                                                               │
│   VpcId: vpc-0014a19e63f41cf99                                                           │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ                         │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   Description: ECS Security Group                                                        │
│   GroupName: sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ                                      │
│   IpPermissions:                                                                         │
│     - FromPort: 80                                                                       │
│       IpProtocol: tcp                                                                    │
│       IpRanges: []                                                                       │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       ToPort: 80                                                                         │
│       UserIdGroupPairs:                                                                  │
│         -                                                                                │
│           GroupId: sg-0d33d0925a8df9124                                                  │
│           UserId: 840541460064                                                           │
│   OwnerId: 840541460064                                                                  │
│   GroupId: sg-0ed32b4daab4b0d89                                                          │
│   IpPermissionsEgress:                                                                   │
│     -                                                                                    │
│       IpProtocol: -1                                                                     │
│       IpRanges:                                                                          │
│         - CidrIp: 0.0.0.0/0                                                              │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       UserIdGroupPairs: []                                                               │
│   Tags:                                                                                  │
│     - Key: gc-created-by-provider                                                        │
│       Value: aws                                                                         │
│     - Key: gc-managed-by                                                                 │
│       Value: grucloud                                                                    │
│     - Key: gc-project-name                                                               │
│       Value: apigw-vpclink-pvt-alb                                                       │
│     - Key: gc-stage                                                                      │
│       Value: dev                                                                         │
│     - Key: Name                                                                          │
│       Value: sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ                  │
│   VpcId: vpc-0014a19e63f41cf99                                                           │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4                           │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   Description: LoadBalancer Security Group                                               │
│   GroupName: sam-app-LoadBalancerSG-10GJVKU6RNTZ4                                        │
│   IpPermissions:                                                                         │
│     - FromPort: 80                                                                       │
│       IpProtocol: tcp                                                                    │
│       IpRanges:                                                                          │
│         - CidrIp: 0.0.0.0/0                                                              │
│           Description: Allow from anyone on port 80                                      │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       ToPort: 80                                                                         │
│       UserIdGroupPairs: []                                                               │
│   OwnerId: 840541460064                                                                  │
│   GroupId: sg-0d33d0925a8df9124                                                          │
│   IpPermissionsEgress:                                                                   │
│     - FromPort: 80                                                                       │
│       IpProtocol: tcp                                                                    │
│       IpRanges: []                                                                       │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       ToPort: 80                                                                         │
│       UserIdGroupPairs:                                                                  │
│         -                                                                                │
│           GroupId: sg-0ed32b4daab4b0d89                                                  │
│           UserId: 840541460064                                                           │
│     -                                                                                    │
│       IpProtocol: -1                                                                     │
│       IpRanges:                                                                          │
│         - CidrIp: 0.0.0.0/0                                                              │
│       Ipv6Ranges: []                                                                     │
│       PrefixListIds: []                                                                  │
│       UserIdGroupPairs: []                                                               │
│   Tags:                                                                                  │
│     - Key: gc-created-by-provider                                                        │
│       Value: aws                                                                         │
│     - Key: gc-managed-by                                                                 │
│       Value: grucloud                                                                    │
│     - Key: gc-project-name                                                               │
│       Value: apigw-vpclink-pvt-alb                                                       │
│     - Key: gc-stage                                                                      │
│       Value: dev                                                                         │
│     - Key: Name                                                                          │
│       Value: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4                    │
│   VpcId: vpc-0014a19e63f41cf99                                                           │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├────────────────────┬────────────────────────────────────────────────────────────────────┤
│ EC2::SecurityGroup │ sg::vpc-default::default                                           │
│                    │ sg::vpclink-ex-vpc::default                                        │
│                    │ sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ         │
│                    │ sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4           │
└────────────────────┴────────────────────────────────────────────────────────────────────┘
4 resources, 1 type, 1 provider
Command "gc l -t EC2::SecurityGroup" executed in 5s, 105 MB
```
