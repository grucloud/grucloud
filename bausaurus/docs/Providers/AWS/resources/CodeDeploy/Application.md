---
id: Application
title: Application
---

Manages an [AWS CodeDeploy Application](https://console.aws.amazon.com/codesuite/codedeploy/applications).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Application",
    group: "CodeDeploy",
    properties: ({}) => ({
      applicationName: "AppECS-cluster-api",
      computePlatform: "ECS",
      tags: [],
    }),
  },
];
```

## Dependencies

- [IAM Role](../IAM/Role.md)

## Used By

- [Deployment Group](./DeploymentGroup)

## Properties

- [CreateApplicationlicationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-codedeploy/interfaces/createapplicationcommandinput.html)

## Full Examples

- [codedeploy-ecs](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodeDeploy/codedeploy-ecs)

## List

The CodeDeploy applications can be filtered with the _Application_ type:

```sh
gc l -t CodeDeploy::Application
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CodeDeploy::Application from aws                                                   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: AppECS-cluster-api                                                             │
│ managedByUs: Yes                                                                     │
│ live:                                                                                │
│   applicationId: 66787a08-1eb6-4366-884e-ef3426fa4272                                │
│   applicationName: AppECS-cluster-api                                                │
│   computePlatform: ECS                                                               │
│   createTime: 2022-07-08T08:21:44.606Z                                               │
│   linkedToGitHub: false                                                              │
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
│       Value: AppECS-cluster-api                                                      │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├─────────────────────────┬───────────────────────────────────────────────────────────┤
│ CodeDeploy::Application │ AppECS-cluster-api                                        │
└─────────────────────────┴───────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CodeDeploy::Application" executed in 6s, 127 MB
```
