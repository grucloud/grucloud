---
id: AutoScalingGroup
title: AutoScaling Group
---

Manages an [AWS Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html).

## List

The auto scaling groups can be filtered with the _AutoScalingGroup_ type:

```sh
gc list --types AutoScalingGroup
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
✓ k8s
  ✓ Initialising
  ✓ Listing
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 AutoScalingGroup from aws                                                                                                     │
├──────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name                                     │ Data                                                                          │ Our  │
├──────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┼──────┤
│ eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb │ AutoScalingGroupName: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                │ NO   │
│                                          │ AutoScalingGroupARN: arn:aws:autoscaling:eu-west-2:840541460064:autoScalingG… │      │
│                                          │ MixedInstancesPolicy:                                                         │      │
│                                          │   LaunchTemplate:                                                             │      │
│                                          │     LaunchTemplateSpecification:                                              │      │
│                                          │       LaunchTemplateId: lt-02974713afc4d401f                                  │      │
│                                          │       LaunchTemplateName: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb            │      │
│                                          │       Version: 1                                                              │      │
│                                          │     Overrides:                                                                │      │
│                                          │       - InstanceType: t2.medium                                               │      │
│                                          │   InstancesDistribution:                                                      │      │
│                                          │     OnDemandAllocationStrategy: prioritized                                   │      │
│                                          │     OnDemandBaseCapacity: 0                                                   │      │
│                                          │     OnDemandPercentageAboveBaseCapacity: 100                                  │      │
│                                          │     SpotAllocationStrategy: lowest-price                                      │      │
│                                          │     SpotInstancePools: 2                                                      │      │
│                                          │ MinSize: 1                                                                    │      │
│                                          │ MaxSize: 1                                                                    │      │
│                                          │ DesiredCapacity: 1                                                            │      │
│                                          │ DefaultCooldown: 300                                                          │      │
│                                          │ AvailabilityZones:                                                            │      │
│                                          │   - "eu-west-2a"                                                              │      │
│                                          │   - "eu-west-2b"                                                              │      │
│                                          │ LoadBalancerNames: []                                                         │      │
│                                          │ TargetGroupARNs: []                                                           │      │
│                                          │ HealthCheckType: EC2                                                          │      │
│                                          │ HealthCheckGracePeriod: 15                                                    │      │
│                                          │ Instances:                                                                    │      │
│                                          │   - InstanceId: i-02bb43a1060614f38                                           │      │
│                                          │     InstanceType: t2.medium                                                   │      │
│                                          │     AvailabilityZone: eu-west-2b                                              │      │
│                                          │     LifecycleState: InService                                                 │      │
│                                          │     HealthStatus: Healthy                                                     │      │
│                                          │     LaunchTemplate:                                                           │      │
│                                          │       LaunchTemplateId: lt-02974713afc4d401f                                  │      │
│                                          │       LaunchTemplateName: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb            │      │
│                                          │       Version: 1                                                              │      │
│                                          │     ProtectedFromScaleIn: false                                               │      │
│                                          │ CreatedTime: 2021-04-10T03:15:07.726Z                                         │      │
│                                          │ SuspendedProcesses: []                                                        │      │
│                                          │ VPCZoneIdentifier: subnet-0015244ffa0cc3088,subnet-03bc4b1022ee1f745          │      │
│                                          │ EnabledMetrics: []                                                            │      │
│                                          │ Tags:                                                                         │      │
│                                          │   - ResourceId: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: eks:cluster-name                                                     │      │
│                                          │     Value: cluster-starhackit                                                 │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: eks:nodegroup-name                                                   │      │
│                                          │     Value: node-group-public-cluster                                          │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: k8s.io/cluster-autoscaler/cluster-starhackit                         │      │
│                                          │     Value: owned                                                              │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: k8s.io/cluster-autoscaler/enabled                                    │      │
│                                          │     Value: true                                                               │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: kubernetes.io/cluster/cluster-starhackit                             │      │
│                                          │     Value: owned                                                              │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │ TerminationPolicies:                                                          │      │
│                                          │   - "AllocationStrategy"                                                      │      │
│                                          │   - "OldestLaunchTemplate"                                                    │      │
│                                          │   - "OldestInstance"                                                          │      │
│                                          │ NewInstancesProtectedFromScaleIn: false                                       │      │
│                                          │ ServiceLinkedRoleARN: arn:aws:iam::840541460064:role/aws-service-role/autosc… │      │
│                                          │ CapacityRebalance: true                                                       │      │
│                                          │                                                                               │      │
├──────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┼──────┤
│ eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78 │ AutoScalingGroupName: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                │ NO   │
│                                          │ AutoScalingGroupARN: arn:aws:autoscaling:eu-west-2:840541460064:autoScalingG… │      │
│                                          │ MixedInstancesPolicy:                                                         │      │
│                                          │   LaunchTemplate:                                                             │      │
│                                          │     LaunchTemplateSpecification:                                              │      │
│                                          │       LaunchTemplateId: lt-060ec66349d49f737                                  │      │
│                                          │       LaunchTemplateName: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78            │      │
│                                          │       Version: 1                                                              │      │
│                                          │     Overrides:                                                                │      │
│                                          │       - InstanceType: t2.medium                                               │      │
│                                          │   InstancesDistribution:                                                      │      │
│                                          │     OnDemandAllocationStrategy: prioritized                                   │      │
│                                          │     OnDemandBaseCapacity: 0                                                   │      │
│                                          │     OnDemandPercentageAboveBaseCapacity: 100                                  │      │
│                                          │     SpotAllocationStrategy: lowest-price                                      │      │
│                                          │     SpotInstancePools: 2                                                      │      │
│                                          │ MinSize: 1                                                                    │      │
│                                          │ MaxSize: 1                                                                    │      │
│                                          │ DesiredCapacity: 1                                                            │      │
│                                          │ DefaultCooldown: 300                                                          │      │
│                                          │ AvailabilityZones:                                                            │      │
│                                          │   - "eu-west-2a"                                                              │      │
│                                          │   - "eu-west-2b"                                                              │      │
│                                          │ LoadBalancerNames: []                                                         │      │
│                                          │ TargetGroupARNs: []                                                           │      │
│                                          │ HealthCheckType: EC2                                                          │      │
│                                          │ HealthCheckGracePeriod: 15                                                    │      │
│                                          │ Instances:                                                                    │      │
│                                          │   - InstanceId: i-0bc600bca948f0a4f                                           │      │
│                                          │     InstanceType: t2.medium                                                   │      │
│                                          │     AvailabilityZone: eu-west-2b                                              │      │
│                                          │     LifecycleState: InService                                                 │      │
│                                          │     HealthStatus: Healthy                                                     │      │
│                                          │     LaunchTemplate:                                                           │      │
│                                          │       LaunchTemplateId: lt-060ec66349d49f737                                  │      │
│                                          │       LaunchTemplateName: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78            │      │
│                                          │       Version: 1                                                              │      │
│                                          │     ProtectedFromScaleIn: false                                               │      │
│                                          │ CreatedTime: 2021-04-10T03:15:28.902Z                                         │      │
│                                          │ SuspendedProcesses: []                                                        │      │
│                                          │ VPCZoneIdentifier: subnet-0adf8aa685537c979,subnet-0e433a70ab3d591f9          │      │
│                                          │ EnabledMetrics: []                                                            │      │
│                                          │ Tags:                                                                         │      │
│                                          │   - ResourceId: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: eks:cluster-name                                                     │      │
│                                          │     Value: cluster-starhackit                                                 │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: eks:nodegroup-name                                                   │      │
│                                          │     Value: node-group-private-cluster                                         │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: k8s.io/cluster-autoscaler/cluster-starhackit                         │      │
│                                          │     Value: owned                                                              │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: k8s.io/cluster-autoscaler/enabled                                    │      │
│                                          │     Value: true                                                               │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │   - ResourceId: eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                      │      │
│                                          │     ResourceType: auto-scaling-group                                          │      │
│                                          │     Key: kubernetes.io/cluster/cluster-starhackit                             │      │
│                                          │     Value: owned                                                              │      │
│                                          │     PropagateAtLaunch: true                                                   │      │
│                                          │ TerminationPolicies:                                                          │      │
│                                          │   - "AllocationStrategy"                                                      │      │
│                                          │   - "OldestLaunchTemplate"                                                    │      │
│                                          │   - "OldestInstance"                                                          │      │
│                                          │ NewInstancesProtectedFromScaleIn: false                                       │      │
│                                          │ ServiceLinkedRoleARN: arn:aws:iam::840541460064:role/aws-service-role/autosc… │      │
│                                          │ CapacityRebalance: true                                                       │      │
│                                          │                                                                               │      │
└──────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                                            │
├────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ AutoScalingGroup   │ eks-24bc5ce2-fb10-f5de-0f75-2e98a1fdbadb                                                                  │
│                    │ eks-5abc5ce2-fb23-1612-004e-c62ca55e1d78                                                                  │
└────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 2 providers
Command "gc l -t Auto" executed in 4s
```
