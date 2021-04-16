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
