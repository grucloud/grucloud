---
id: Service
title: Service
---

Provides an AppRunner Service.

## Examples

### Create a AppRunner service from a docker image

```js

```

### Create a AppRunner service from GitHub repository

```js

```

## Source Code Examples

- [apprunner-simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppRunner/apprunner-simple/resources.js)

## Properties

- [createService properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#createService-property)

## Dependencies

- [Iam Role](../IAM/Role.md)
- [AppRunner Connection](./Connection.md)
- [ECR Repository](../ECR/Repository.md)

## List

The list of AppRunner services can be displayed and filtered with the type **Service**:

```sh
gc list -t AppRunner::Service
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 AppRunner::Service from aws                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ name: plantuml-server                                                    │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ServiceName: plantuml-server                                           │
│   ServiceId: f104311171ce443b8b8882cf8ad84630                            │
│   ServiceArn: arn:aws:apprunner:us-east-1:840541460064:service/plantuml… │
│   ServiceUrl: 5fbpjdtpzd.us-east-1.awsapprunner.com                      │
│   CreatedAt: 2022-02-15T03:06:19.000Z                                    │
│   UpdatedAt: 2022-02-15T03:06:19.000Z                                    │
│   Status: CREATE_FAILED                                                  │
│   SourceConfiguration:                                                   │
│     ImageRepository:                                                     │
│       ImageIdentifier: 840541460064.dkr.ecr.us-east-1.amazonaws.com/pla… │
│       ImageConfiguration:                                                │
│         Port: 8080                                                       │
│       ImageRepositoryType: ECR                                           │
│     AutoDeploymentsEnabled: false                                        │
│     AuthenticationConfiguration:                                         │
│       AccessRoleArn: arn:aws:iam::840541460064:role/service-role/AppRun… │
│   InstanceConfiguration:                                                 │
│     Cpu: 1024                                                            │
│     Memory: 2048                                                         │
│   HealthCheckConfiguration:                                              │
│     Protocol: TCP                                                        │
│     Path: /                                                              │
│     Interval: 10                                                         │
│     Timeout: 5                                                           │
│     HealthyThreshold: 1                                                  │
│     UnhealthyThreshold: 5                                                │
│   AutoScalingConfigurationSummary:                                       │
│     AutoScalingConfigurationArn: arn:aws:apprunner:us-east-1:8405414600… │
│     AutoScalingConfigurationName: DefaultConfiguration                   │
│     AutoScalingConfigurationRevision: 1                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├────────────────────┬────────────────────────────────────────────────────┤
│ AppRunner::Service │ plantuml-server                                    │
└────────────────────┴────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Service" executed in 4s

```
