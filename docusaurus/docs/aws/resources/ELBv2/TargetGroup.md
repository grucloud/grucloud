---
id: AwsTargetGroup
title: Target Group
---

Manage an [ELB Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html).

## Example

### TargetGroup attached to a EKS Node Group

In this exmaple, we'll create TargetGroup associated to an [EKS Node Group](../EKS/EksNodeGroup.md).
When an EKS Node Group is created, an [Auto Scaling Group](../AutoScaling/AutoScalingGroup.md) is also created. During the deployment, the Target Group is attached automatically to the Auto Scaling Group.

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const nodeGroup = {}; // Insert node group here

const targetGroupRest = await provider.makeTargetGroup({
  name: "target-group-rest",
  dependencies: {
    vpc,
    nodeGroup,
  },
  properties: () => ({
    Port: 30020,
    HealthCheckPath: "/api/v1/version",
  }),
});
```

## Properties

The list of properties are the parameter of [createTargetGroup](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property)

## Source Code

- [module AWS Load Balancer]()

## Dependencies

- [VPC](../EC2/Vpc.md)
- [EKS NodeGroup](../EKS/EksNodeGroup.md)

## List

```sh
gc l -t TargetGroup
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
✓ k8s
  ✓ Initialising
  ✓ Listing
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 2 TargetGroup from aws                                                           │
├───────────────────┬───────────────────────────────────────────────────────┬──────┤
│ Name              │ Data                                                  │ Our  │
├───────────────────┼───────────────────────────────────────────────────────┼──────┤
│ target-group-rest │ TargetGroupArn: arn:aws:elasticloadbalancing:eu-west… │ Yes  │
│                   │ TargetGroupName: target-group-rest                    │      │
│                   │ Protocol: HTTP                                        │      │
│                   │ Port: 30020                                           │      │
│                   │ VpcId: vpc-03b8d521b703d6c46                          │      │
│                   │ HealthCheckProtocol: HTTP                             │      │
│                   │ HealthCheckPort: traffic-port                         │      │
│                   │ HealthCheckEnabled: true                              │      │
│                   │ HealthCheckIntervalSeconds: 30                        │      │
│                   │ HealthCheckTimeoutSeconds: 5                          │      │
│                   │ HealthyThresholdCount: 5                              │      │
│                   │ UnhealthyThresholdCount: 2                            │      │
│                   │ HealthCheckPath: /api/v1/version                      │      │
│                   │ Matcher:                                              │      │
│                   │   HttpCode: 200                                       │      │
│                   │ LoadBalancerArns:                                     │      │
│                   │   - "arn:aws:elasticloadbalancing:eu-west-2:84054146… │      │
│                   │ TargetType: instance                                  │      │
│                   │ ProtocolVersion: HTTP1                                │      │
│                   │ Tags:                                                 │      │
│                   │   - Key: ManagedBy                                    │      │
│                   │     Value: GruCloud                                   │      │
│                   │   - Key: stage                                        │      │
│                   │     Value: dev                                        │      │
│                   │   - Key: projectName                                  │      │
│                   │     Value: starhackit                                 │      │
│                   │   - Key: CreatedByProvider                            │      │
│                   │     Value: aws                                        │      │
│                   │   - Key: Name                                         │      │
│                   │     Value: target-group-rest                          │      │
│                   │                                                       │      │
├───────────────────┼───────────────────────────────────────────────────────┼──────┤
│ target-group-web  │ TargetGroupArn: arn:aws:elasticloadbalancing:eu-west… │ Yes  │
│                   │ TargetGroupName: target-group-web                     │      │
│                   │ Protocol: HTTP                                        │      │
│                   │ Port: 30010                                           │      │
│                   │ VpcId: vpc-03b8d521b703d6c46                          │      │
│                   │ HealthCheckProtocol: HTTP                             │      │
│                   │ HealthCheckPort: traffic-port                         │      │
│                   │ HealthCheckEnabled: true                              │      │
│                   │ HealthCheckIntervalSeconds: 30                        │      │
│                   │ HealthCheckTimeoutSeconds: 5                          │      │
│                   │ HealthyThresholdCount: 5                              │      │
│                   │ UnhealthyThresholdCount: 2                            │      │
│                   │ HealthCheckPath: /                                    │      │
│                   │ Matcher:                                              │      │
│                   │   HttpCode: 200                                       │      │
│                   │ LoadBalancerArns:                                     │      │
│                   │   - "arn:aws:elasticloadbalancing:eu-west-2:84054146… │      │
│                   │ TargetType: instance                                  │      │
│                   │ ProtocolVersion: HTTP1                                │      │
│                   │ Tags:                                                 │      │
│                   │   - Key: ManagedBy                                    │      │
│                   │     Value: GruCloud                                   │      │
│                   │   - Key: stage                                        │      │
│                   │     Value: dev                                        │      │
│                   │   - Key: projectName                                  │      │
│                   │     Value: starhackit                                 │      │
│                   │   - Key: CreatedByProvider                            │      │
│                   │     Value: aws                                        │      │
│                   │   - Key: Name                                         │      │
│                   │     Value: target-group-web                           │      │
│                   │                                                       │      │
└───────────────────┴───────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├────────────────────┬────────────────────────────────────────────────────────────┤
│ TargetGroup        │ target-group-rest                                          │
│                    │ target-group-web                                           │
└────────────────────┴────────────────────────────────────────────────────────────┘
2 resources, 1 type, 2 providers
Command "gc l -t TargetGroup" executed in 7s

```
