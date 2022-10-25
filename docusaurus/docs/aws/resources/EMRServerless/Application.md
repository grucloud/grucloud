---
id: Application
title: Application
---

Manages a [EMR Serverless Application](https://console.aws.amazon.com/emr/home#/serverless).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Application",
    group: "EMRServerless",
    properties: ({}) => ({
      name: "My_First_Application",
      releaseLabel: "emr-6.8.0",
      type: "Spark",
    }),
  },
];
```

## Properties

- [CreateApplicationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-emr-serverless/interfaces/createapplicationcommandinput.html)

## Dependencies

- [EC2 Security Group](../EC2/SecurityGroup.md)
- [EC2 Subnet](../EC2/Subnet.md)

## Used By

## Full Examples

- [emr serverless simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/EMRServerless/emr-serverless-simple)

## List

```sh
gc l -t EMRServerless::Application
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EMRServerless::Application from aws                                                │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: My_First_Application                                                           │
│ managedByUs: Yes                                                                     │
│ live:                                                                                │
│   applicationId: 00f52d4saht0ld09                                                    │
│   arn: arn:aws:emr-serverless:us-east-1:840541460064:/applications/00f52d4saht0ld09  │
│   autoStartConfiguration:                                                            │
│     enabled: true                                                                    │
│   autoStopConfiguration:                                                             │
│     enabled: true                                                                    │
│     idleTimeoutMinutes: 15                                                           │
│   createdAt: 2022-10-25T13:56:32.406Z                                                │
│   initialCapacity:                                                                   │
│     Driver:                                                                          │
│       workerConfiguration:                                                           │
│         cpu: 4 vCPU                                                                  │
│         disk: 20 GB                                                                  │
│         memory: 16 GB                                                                │
│       workerCount: 1                                                                 │
│     Executor:                                                                        │
│       workerConfiguration:                                                           │
│         cpu: 4 vCPU                                                                  │
│         disk: 20 GB                                                                  │
│         memory: 16 GB                                                                │
│       workerCount: 2                                                                 │
│   maximumCapacity:                                                                   │
│     cpu: 400 vCPU                                                                    │
│     disk: 20000 GB                                                                   │
│     memory: 3000 GB                                                                  │
│   name: My_First_Application                                                         │
│   releaseLabel: emr-6.8.0                                                            │
│   state: CREATED                                                                     │
│   stateDetails: Application created by user.                                         │
│   tags:                                                                              │
│     gc-managed-by: grucloud                                                          │
│     gc-project-name: emr-serverless-simple                                           │
│     gc-stage: dev                                                                    │
│     gc-created-by-provider: aws                                                      │
│     Name: My_First_Application                                                       │
│   type: Spark                                                                        │
│   updatedAt: 2022-10-25T13:56:32.406Z                                                │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├────────────────────────────┬────────────────────────────────────────────────────────┤
│ EMRServerless::Application │ My_First_Application                                   │
└────────────────────────────┴────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EMRServerless::Application" executed in 3s, 98 MB
```
