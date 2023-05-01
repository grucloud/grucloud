// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Repository",
    group: "ECR",
    properties: ({ config }) => ({
      repositoryName: "starhackit/lb",
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
            action: {
              type: "expire",
            },
            description: "Expire images older than 14 days",
            rulePriority: 1,
            selection: {
              countNumber: 14,
              countType: "sinceImagePushed",
              countUnit: "days",
              tagStatus: "untagged",
            },
          },
        ],
      },
    }),
  },
];
