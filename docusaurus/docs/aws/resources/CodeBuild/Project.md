---
id: Project
title: Project
---

Manages an [AWS CodeBuild Project](https://console.aws.amazon.com/codesuite/codebuild/projects).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Project",
    group: "CodeBuild",
    properties: ({}) => ({
      artifacts: {
        type: "NO_ARTIFACTS",
      },
      environment: {
        computeType: "BUILD_GENERAL1_SMALL",
        environmentVariables: [],
        image: "aws/codebuild/amazonlinux2-x86_64-standard:4.0",
        imagePullCredentialsType: "CODEBUILD",
        privilegedMode: true,
        type: "LINUX_CONTAINER",
      },
      logsConfig: {
        cloudWatchLogs: {
          status: "ENABLED",
        },
        s3Logs: {
          encryptionDisabled: false,
          status: "DISABLED",
        },
      },
      name: "my-project",
      source: {
        buildspec:
          "version: 0.2\n\nphases:\n  build:\n    commands:\n       - npm install\n",
        location: "https://github.com/grucloud/grucloud",
        type: "GITHUB",
      },
      sourceVersion: "main",
    }),
    dependencies: ({}) => ({
      serviceRole: "codebuild-my-project-service-role",
    }),
  },
];
```

## Dependencies

- [IAM Role](../IAM/Role.md)
- [Vpc](../EC2/Vpc.md)
- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## Used By

- [CodePipeline Pipeline](../CodePipeline/Pipeline.md)
- [CloudWatchEvents Target](../CloudWatchEvents/Target.md)

## Properties

- [CreateProjectCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-codebuild/interfaces/createprojectcommandinput.html)

## Full Examples

- [codebuild-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodeBuild/codebuild-simple)

## List

The projects can be filtered with the _Project_ type:

```sh
gc l -t Project
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 CodeBuild::Project from aws                                        │
├──────────────────────────────────────────────────────────────────────┤
│ name: my-project                                                     │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   arn: arn:aws:codebuild:us-east-1:840541460064:project/my-project   │
│   artifacts:                                                         │
│     type: NO_ARTIFACTS                                               │
│   badge:                                                             │
│     badgeEnabled: false                                              │
│   cache:                                                             │
│     type: NO_CACHE                                                   │
│   created: 2022-07-06T20:03:37.661Z                                  │
│   encryptionKey: arn:aws:kms:us-east-1:840541460064:alias/aws/s3     │
│   environment:                                                       │
│     computeType: BUILD_GENERAL1_SMALL                                │
│     environmentVariables: []                                         │
│     image: aws/codebuild/amazonlinux2-x86_64-standard:4.0            │
│     imagePullCredentialsType: CODEBUILD                              │
│     privilegedMode: true                                             │
│     type: LINUX_CONTAINER                                            │
│   lastModified: 2022-07-06T20:03:37.661Z                             │
│   logsConfig:                                                        │
│     cloudWatchLogs:                                                  │
│       status: ENABLED                                                │
│     s3Logs:                                                          │
│       encryptionDisabled: false                                      │
│       status: DISABLED                                               │
│   name: my-project                                                   │
│   projectVisibility: PRIVATE                                         │
│   queuedTimeoutInMinutes: 480                                        │
│   secondaryArtifacts: []                                             │
│   secondarySourceVersions: []                                        │
│   secondarySources: []                                               │
│   serviceRole: arn:aws:iam::840541460064:role/service-role/codebuil… │
│   source:                                                            │
│     buildspec: version: 0.2                                          │
│                                                                      │
│ phases:                                                              │
│   build:                                                             │
│     commands:                                                        │
│        - npm install                                                 │
│                                                                      │
│     gitCloneDepth: 1                                                 │
│     gitSubmodulesConfig:                                             │
│       fetchSubmodules: false                                         │
│     insecureSsl: false                                               │
│     location: https://github.com/grucloud/grucloud                   │
│     reportBuildStatus: false                                         │
│     type: GITHUB                                                     │
│   sourceVersion: main                                                │
│   tags: []                                                           │
│   timeoutInMinutes: 60                                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├────────────────────┬────────────────────────────────────────────────┤
│ CodeBuild::Project │ my-project                                     │
└────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t CodeBuild::Project" executed in 7s, 104 MB
```
