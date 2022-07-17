---
id: Job
title: Job
---

Manages an [Glue Job](https://console.aws.amazon.com/gluestudio/home?#/jobs).

## Sample code

```js
exports.createResources = () => [
];
```

## Properties

- [CreateJobCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest//clients/client-glue/interfaces/createjobcommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)

## Full Examples

- [Step function invoking a Glue job](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-glue)

## List

The jobs can be filtered with the _Job_ type:

```sh
gc l -t Job
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1 
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 Glue::Job from aws                                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: sample-glue-job-terraform                                              │
│ managedByUs: Yes                                                             │
│ live:                                                                        │
│   AllocatedCapacity: 2                                                       │
│   Command:                                                                   │
│     Name: glueetl                                                            │
│     PythonVersion: 3                                                         │
│     ScriptLocation: s3://sample-bucket-glue-scripts-terraform-840541460064/… │
│   CreatedOn: 2022-07-13T10:22:38.257Z                                        │
│   DefaultArguments:                                                          │
│     --TempDir: s3://sample-bucket-glue-scripts-terraform-840541460064/tmp/   │
│     --job-bookmark-option: job-bookmark-disable                              │
│     --job-language: python                                                   │
│   Description: AWS Glue Job terraform example                                │
│   ExecutionProperty:                                                         │
│     MaxConcurrentRuns: 5                                                     │
│   GlueVersion: 3.0                                                           │
│   LastModifiedOn: 2022-07-13T10:22:38.257Z                                   │
│   MaxCapacity: 2                                                             │
│   MaxRetries: 0                                                              │
│   Name: sample-glue-job-terraform                                            │
│   NumberOfWorkers: 2                                                         │
│   Role: arn:aws:iam::840541460064:role/sample-glue-role                      │
│   Timeout: 2880                                                              │
│   WorkerType: G.1X                                                           │
│   Tags:                                                                      │
│     Name: sample-glue-job-terraform                                          │
│     gc-created-by-provider: aws                                              │
│     gc-managed-by: grucloud                                                  │
│     gc-project-name: sfn-glue                                                │
│     gc-stage: dev                                                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├───────────┬─────────────────────────────────────────────────────────────────┤
│ Glue::Job │ sample-glue-job-terraform                                       │
└───────────┴─────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Job" executed in 5s, 121 MB
```
