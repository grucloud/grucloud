---
id: Repository
title: Repository
---

Manages a [ECR Docker Repository](https://console.aws.amazon.com/ecr/home)

## Sample Code

```js
exports.createResources = () => [
  {
    type: "Repository",
    group: "ECR",
    name: "starhackit/lb",
    properties: ({ config }) => ({
      imageTagMutability: "MUTABLE",
      imageScanningConfiguration: {
        scanOnPush: false,
      },
      encryptionConfiguration: {
        encryptionType: "AES256",
      },
      policyText: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "AllowPushPull",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: [
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage",
              "ecr:BatchCheckLayerAvailability",
              "ecr:PutImage",
              "ecr:InitiateLayerUpload",
              "ecr:UploadLayerPart",
              "ecr:CompleteLayerUpload",
            ],
          },
        ],
      },
      lifecyclePolicyText: {
        rules: [
          {
            rulePriority: 1,
            description: "Expire images older than 14 days",
            selection: {
              tagStatus: "untagged",
              countType: "sinceImagePushed",
              countUnit: "days",
              countNumber: 14,
            },
            action: {
              type: "expire",
            },
          },
        ],
      },
    }),
  },
];
```

### Dependencies

- [KMS Key](../KMS/Key.md)

### Used By

- [CodePipeline Pipeline](../CodePipeline/Pipeline.md)

### Full Examples

- [Registry and Repository](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECR/repository)
- [Code Pipeline](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodePipeline/code-pipeline-ecr)
- [App Runner](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppRunner/apprunner-simple)

### Properties

- [SetRepositoryPolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecr/interfaces/setrepositorypolicycommandinput.html)

- [PutLifecyclePolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecr/interfaces/putlifecyclepolicycommandinput.html)

### List

```sh
gc l -t ECR::Repository
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ECR::Repository from aws                                                            │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ name: starhackit/lb                                                                   │
│ managedByUs: Yes                                                                      │
│ live:                                                                                 │
│   createdAt: 2022-07-30T11:08:11.000Z                                                 │
│   encryptionConfiguration:                                                            │
│     encryptionType: AES256                                                            │
│   imageScanningConfiguration:                                                         │
│     scanOnPush: false                                                                 │
│   imageTagMutability: MUTABLE                                                         │
│   registryId: 840541460064                                                            │
│   repositoryArn: arn:aws:ecr:us-east-1:840541460064:repository/starhackit/lb          │
│   repositoryName: starhackit/lb                                                       │
│   repositoryUri: 840541460064.dkr.ecr.us-east-1.amazonaws.com/starhackit/lb           │
│   lifecyclePolicyText:                                                                │
│     rules:                                                                            │
│       - rulePriority: 1                                                               │
│         description: Expire images older than 14 days                                 │
│         selection:                                                                    │
│           tagStatus: untagged                                                         │
│           countType: sinceImagePushed                                                 │
│           countUnit: days                                                             │
│           countNumber: 14                                                             │
│         action:                                                                       │
│           type: expire                                                                │
│   tags:                                                                               │
│     - Key: gc-created-by-provider                                                     │
│       Value: aws                                                                      │
│     - Key: gc-managed-by                                                              │
│       Value: grucloud                                                                 │
│     - Key: gc-project-name                                                            │
│       Value: aws-ecr-repository                                                       │
│     - Key: gc-stage                                                                   │
│       Value: dev                                                                      │
│     - Key: Name                                                                       │
│       Value: starhackit/lb                                                            │
│   policyText:                                                                         │
│     Version: 2008-10-17                                                               │
│     Statement:                                                                        │
│       - Sid: AllowPushPull                                                            │
│         Effect: Allow                                                                 │
│         Principal:                                                                    │
│           AWS: arn:aws:iam::840541460064:root                                         │
│         Action:                                                                       │
│           - "ecr:GetDownloadUrlForLayer"                                              │
│           - "ecr:BatchGetImage"                                                       │
│           - "ecr:BatchCheckLayerAvailability"                                         │
│           - "ecr:PutImage"                                                            │
│           - "ecr:InitiateLayerUpload"                                                 │
│           - "ecr:UploadLayerPart"                                                     │
│           - "ecr:CompleteLayerUpload"                                                 │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├─────────────────┬────────────────────────────────────────────────────────────────────┤
│ ECR::Repository │ starhackit/lb                                                      │
└─────────────────┴────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ECR::Repository" executed in 5s, 114 MB
```
