---
id: Pipeline
title: Pipeline
---

Manages an [AWS CodePipeline Pipeline](https://console.aws.amazon.com/codesuite/codepipeline/pipelines).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Pipeline",
    group: "CodePipeline",
    properties: ({}) => ({
      pipeline: {
        artifactStore: {
          location: "codepipeline-us-east-1-149415713660",
          type: "S3",
        },
        name: "my-pipeline",
        stages: [
          {
            actions: [
              {
                actionTypeId: {
                  category: "Source",
                  owner: "AWS",
                  provider: "ECR",
                  version: "1",
                },
                configuration: {
                  RepositoryName: "starhackit",
                },
                inputArtifacts: [],
                name: "Source",
                namespace: "SourceVariables",
                outputArtifacts: [
                  {
                    name: "SourceArtifact",
                  },
                ],
                region: "us-east-1",
                runOrder: 1,
              },
            ],
            name: "Source",
          },
          {
            actions: [
              {
                actionTypeId: {
                  category: "Build",
                  owner: "AWS",
                  provider: "CodeBuild",
                  version: "1",
                },
                configuration: {
                  ProjectName: "my-project",
                },
                inputArtifacts: [
                  {
                    name: "SourceArtifact",
                  },
                ],
                name: "Build",
                namespace: "BuildVariables",
                outputArtifacts: [
                  {
                    name: "BuildArtifact",
                  },
                ],
                region: "us-east-1",
                runOrder: 1,
              },
            ],
            name: "Build",
          },
        ],
        version: 1,
      },
    }),
    dependencies: ({}) => ({
      role: "AWSCodePipelineServiceRole-my-pipeline",
      codeBuildProject: ["my-project"],
      ecrRepository: ["starhackit"],
    }),
  },
];
```

## Dependencies

- [IAM Role](../IAM/Role.md)
- [CodeStarConnections Connection](../CodeStarConnections/Connection.md)
- [CodeBuild Project](../CodeBuild/Project.md)
- [ECR Repository](../ECR/Repository.md)
- [S3 Bucket](../S3/Bucket.md)

## Used By

- [CloudWatchEvents Target](../CloudWatchEvents/Target.md)

## Properties

- [CreatePipelineCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-codepipeline/interfaces/createpipelinecommandinput.html)

## Full Examples

- [CodePipeline code-pipeline-ecr](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodePipeline/code-pipeline-ecr)

## List

The pipelines can be filtered with the _Pipeline_ type:

```sh
gc l -t CodePipeline::Pipeline
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CodePipeline::Pipeline from aws                                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-pipeline                                                                       │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   artifactStore:                                                                        │
│     location: codepipeline-us-east-1-709458114120                                       │
│     type: S3                                                                            │
│   name: my-pipeline                                                                     │
│   roleArn: arn:aws:iam::840541460064:role/service-role/AWSCodePipelineServiceRole-us-e… │
│   stages:                                                                               │
│     - actions:                                                                          │
│         - actionTypeId:                                                                 │
│             category: Source                                                            │
│             owner: AWS                                                                  │
│             provider: CodeStarSourceConnection                                          │
│             version: 1                                                                  │
│           configuration:                                                                │
│             BranchName: master                                                          │
│             ConnectionArn: arn:aws:codestar-connections:us-east-1:840541460064:connect… │
│             FullRepositoryId: FredericHeem/starhackit                                   │
│             OutputArtifactFormat: CODE_ZIP                                              │
│           inputArtifacts: []                                                            │
│           name: Source                                                                  │
│           namespace: SourceVariables                                                    │
│           outputArtifacts:                                                              │
│             - name: SourceArtifact                                                      │
│           region: us-east-1                                                             │
│           runOrder: 1                                                                   │
│       name: Source                                                                      │
│     - actions:                                                                          │
│         - actionTypeId:                                                                 │
│             category: Build                                                             │
│             owner: AWS                                                                  │
│             provider: CodeBuild                                                         │
│             version: 1                                                                  │
│           configuration:                                                                │
│             ProjectName: starhackit                                                     │
│           inputArtifacts:                                                               │
│             - name: SourceArtifact                                                      │
│           name: Build                                                                   │
│           namespace: BuildVariables                                                     │
│           outputArtifacts:                                                              │
│             - name: BuildArtifact                                                       │
│           region: us-east-1                                                             │
│           runOrder: 1                                                                   │
│       name: Build                                                                       │
│   version: 1                                                                            │
│   pipelineArn: arn:aws:codepipeline:us-east-1:840541460064:my-pipeline                  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├────────────────────────┬───────────────────────────────────────────────────────────────┤
│ CodePipeline::Pipeline │ my-pipeline                                                   │
└────────────────────────┴───────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CodePipeline::Pipeline" executed in 4s, 100 MB
```
