---
id: DeploymentGroup
title: DeploymentGroup
---

Manages an [AWS CodeDeploy DeploymentGroup](https://console.aws.amazon.com/codesuite/codedeploy/deployment-configs).

## Sample code

```js
exports.createResources = () => [
  {
    type: "DeploymentGroup",
    group: "CodeDeploy",
    properties: ({ getId }) => ({
      applicationName: "AppECS-cluster-api",
      autoRollbackConfiguration: {
        enabled: true,
        events: ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_REQUEST"],
      },
      blueGreenDeploymentConfiguration: {
        deploymentReadyOption: {
          actionOnTimeout: "CONTINUE_DEPLOYMENT",
          waitTimeInMinutes: 0,
        },
        terminateBlueInstancesOnDeploymentSuccess: {
          action: "TERMINATE",
          terminationWaitTimeInMinutes: 60,
        },
      },
      computePlatform: "ECS",
      deploymentConfigName: "CodeDeployDefault.ECSAllAtOnce",
      deploymentGroupName: "DgpECS-cluster-api",
      deploymentStyle: {
        deploymentOption: "WITH_TRAFFIC_CONTROL",
        deploymentType: "BLUE_GREEN",
      },
      ecsServices: [
        {
          clusterName: `${getId({
            type: "Cluster",
            group: "ECS",
            name: "cluster",
            path: "name",
          })}`,
          serviceName: `${getId({
            type: "Service",
            group: "ECS",
            name: "api",
            path: "name",
          })}`,
        },
      ],
      loadBalancerInfo: {
        targetGroupPairInfoList: [
          {
            prodTrafficRoute: {
              listenerArns: [
                `${getId({
                  type: "Listener",
                  group: "ElasticLoadBalancingV2",
                  name: "listener::EC2Co-EcsEl-GK4BG406T8NP::HTTP::80",
                })}`,
              ],
            },
            targetGroups: [
              {
                name: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "EC2Co-Defau-MMUISWY3DEAQ",
                  path: "name",
                })}`,
              },
              {
                name: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "tg-cluste-api-2",
                  path: "name",
                })}`,
              },
            ],
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      application: "AppECS-cluster-api",
      serviceRole: "roleECSCodeDeploy",
      ecsServices: ["api"],
      ecsClusters: ["cluster"],
      targetGroups: ["EC2Co-Defau-MMUISWY3DEAQ", "tg-cluste-api-2"],
      listeners: ["listener::EC2Co-EcsEl-GK4BG406T8NP::HTTP::80"],
    }),
  },
];
```

## Dependencies

- [Application](./Application.md)
- [IAM Role](../IAM/Role.md)
- [ECS Cluster](../ECS/Cluster.md)
- [ECS Service](../ECS/Service.md)
- [ElasticLoadBalancingV2 Listener](../ElasticLoadBalancingV2/Listener.md)
- [ElasticLoadBalancingV2 TargetGroup](../ElasticLoadBalancingV2/TargetGroup.md)

## Properties

- [CreateDeploymentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-codedeploy/interfaces/createdeploymentcommandinput.html)

## Full Examples

- [codedeploy-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodeDeploy/codedeploy-simple)

## List

The CodeDeploy deployment groups can be filtered with the _DeploymentGroup_ type:

```sh
gc l -t CodeDeploy::DeploymentGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CodeDeploy::DeploymentGroup from aws                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: AppECS-cluster-api::DgpECS-cluster-api                                         │
│ managedByUs: Yes                                                                     │
│ live:                                                                                │
│   applicationName: AppECS-cluster-api                                                │
│   autoRollbackConfiguration:                                                         │
│     enabled: true                                                                    │
│     events:                                                                          │
│       - "DEPLOYMENT_FAILURE"                                                         │
│       - "DEPLOYMENT_STOP_ON_REQUEST"                                                 │
│   blueGreenDeploymentConfiguration:                                                  │
│     deploymentReadyOption:                                                           │
│       actionOnTimeout: CONTINUE_DEPLOYMENT                                           │
│       waitTimeInMinutes: 0                                                           │
│     terminateBlueInstancesOnDeploymentSuccess:                                       │
│       action: TERMINATE                                                              │
│       terminationWaitTimeInMinutes: 60                                               │
│   computePlatform: ECS                                                               │
│   deploymentConfigName: CodeDeployDefault.ECSAllAtOnce                               │
│   deploymentGroupId: 75583d6c-d7fe-41ce-b2ce-c48414a87b3d                            │
│   deploymentGroupName: DgpECS-cluster-api                                            │
│   deploymentStyle:                                                                   │
│     deploymentOption: WITH_TRAFFIC_CONTROL                                           │
│     deploymentType: BLUE_GREEN                                                       │
│   ecsServices:                                                                       │
│     - clusterName: cluster                                                           │
│       serviceName: api                                                               │
│   loadBalancerInfo:                                                                  │
│     targetGroupPairInfoList:                                                         │
│       - prodTrafficRoute:                                                            │
│           listenerArns:                                                              │
│             - "arn:aws:elasticloadbalancing:us-east-1:840541460064:listener/app/EC2… │
│         targetGroups:                                                                │
│           - name: EC2Co-Defau-MMUISWY3DEAQ                                           │
│           - name: tg-cluste-api-2                                                    │
│   outdatedInstancesStrategy: UPDATE                                                  │
│   serviceRoleArn: arn:aws:iam::840541460064:role/roleECSCodeDeploy                   │
│   triggerConfigurations: []                                                          │
│   tags:                                                                              │
│     - Key: gc-created-by-provider                                                    │
│       Value: aws                                                                     │
│     - Key: gc-managed-by                                                             │
│       Value: grucloud                                                                │
│     - Key: gc-project-name                                                           │
│       Value: codedeploy-ecs                                                          │
│     - Key: gc-stage                                                                  │
│       Value: dev                                                                     │
│     - Key: Name                                                                      │
│       Value: AppECS-cluster-api::DgpECS-cluster-api                                  │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├─────────────────────────────┬───────────────────────────────────────────────────────┤
│ CodeDeploy::DeploymentGroup │ AppECS-cluster-api::DgpECS-cluster-api                │
└─────────────────────────────┴───────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CodeDeploy::DeploymentGroup" executed in 8s, 126 MB
```
