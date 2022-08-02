---
id: TargetGroup
title: Target Group
---

Manages an [ELB Target Group](https://console.aws.amazon.com/ec2/v2/home?#TargetGroups:).

A target group can be attached directly to an AutoScaling Group or an AutoScaling Group created by an EKS Node Group.

## Example

```js
exports.createResources = () => [
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    name: "target-group-rest",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 30020,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      HealthCheckEnabled: true,
      HealthCheckIntervalSeconds: 30,
      HealthCheckTimeoutSeconds: 5,
      HealthyThresholdCount: 5,
      HealthCheckPath: "/api/v1/version",
      Matcher: {
        HttpCode: "200",
      },
      TargetType: "instance",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
];
```

## Properties

The list of properties are the parameter of [CreateTargetGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elastic-load-balancing-v2/interfaces/createtargetgroupcommandinput.html)

## Source Code

- [Load Balancer simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/ElasticLoadBalancingV2/load-balancer)
- [code deploy ecs](https://github.com/grucloud/grucloud/blob/main/examples/aws/CodeDeploy/codedeploy-ecs)
- [EKS with load balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/EKS/eks-load-balancer)
- [Route53 failover policy](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/routing-failover-policy)
- [serverless-patterns apigw-fargate-cdk](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-fargate-cdk)
- [serverless-patterns apigw-vpclink-pvt-alb](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)
- [serverless-patterns fargate-aurora-serverless-cdk](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk)
- [serverless-patterns fargate-eventbridge](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-eventbridge)
- [wafv2-loadbalancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-loadbalancer)

## Dependencies

- [VPC](../EC2/Vpc.md)
- [EKS NodeGroup](../EKS/NodeGroup.md)

## Used By

- [AutoScalingGroup](../AutoScaling/AutoScalingGroup.md)
- [CodeDeploy DeploymentGroup](../CodeDeploy/DeploymentGroup.md)
- [ECS Service](../ECS/Service.md)
- [ECS TaskSet](../ECS/TaskSet.md)

## List

```sh
gc l -t TargetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2 ElasticLoadBalancingV2::TargetGroup from aws                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: target-group-rest                                                     │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ… │
│   TargetGroupName: target-group-rest                                        │
│   Protocol: HTTP                                                            │
│   Port: 30020                                                               │
│   VpcId: vpc-055bc1b8bdcbd18ac                                              │
│   HealthCheckProtocol: HTTP                                                 │
│   HealthCheckPort: traffic-port                                             │
│   HealthCheckEnabled: true                                                  │
│   HealthCheckIntervalSeconds: 30                                            │
│   HealthCheckTimeoutSeconds: 5                                              │
│   HealthyThresholdCount: 5                                                  │
│   UnhealthyThresholdCount: 2                                                │
│   HealthCheckPath: /                                                        │
│   Matcher:                                                                  │
│     HttpCode: 200                                                           │
│   LoadBalancerArns:                                                         │
│     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap… │
│   TargetType: instance                                                      │
│   ProtocolVersion: HTTP1                                                    │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: @grucloud/example-aws-elbv2-loadbalancer                       │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: target-group-rest                                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: target-group-web                                                      │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   TargetGroupArn: arn:aws:elasticloadbalancing:us-east-1:840541460064:targ… │
│   TargetGroupName: target-group-web                                         │
│   Protocol: HTTP                                                            │
│   Port: 30010                                                               │
│   VpcId: vpc-055bc1b8bdcbd18ac                                              │
│   HealthCheckProtocol: HTTP                                                 │
│   HealthCheckPort: traffic-port                                             │
│   HealthCheckEnabled: true                                                  │
│   HealthCheckIntervalSeconds: 30                                            │
│   HealthCheckTimeoutSeconds: 5                                              │
│   HealthyThresholdCount: 5                                                  │
│   UnhealthyThresholdCount: 2                                                │
│   HealthCheckPath: /                                                        │
│   Matcher:                                                                  │
│     HttpCode: 200                                                           │
│   LoadBalancerArns:                                                         │
│     - "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/ap… │
│   TargetType: instance                                                      │
│   ProtocolVersion: HTTP1                                                    │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: @grucloud/example-aws-elbv2-loadbalancer                       │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: target-group-web                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├────────────────────┬───────────────────────────────────────────────────────┤
│ ElasticLoadBalancingV2::TargetGroup │ target-group-rest                                     │
│                    │ target-group-web                                      │
└────────────────────┴───────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t TargetGroup" executed in 4s
```
