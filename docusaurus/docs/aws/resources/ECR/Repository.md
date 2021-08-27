---
id: Registry
title: Registry
---

Manages a [Docker Repository](https://console.aws.amazon.com/ecr/home)

## Sample Code

```js
provider.ecr.makeRepository({
  name: "my-repo",
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
            AWS: "arn:aws:iam::840541460064:root",
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
});
```

### Full Examples

- [Registry and Repository](https://github.com/grucloud/grucloud/tree/main/examples/aws/ecr/repository)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#createRepository-property)
