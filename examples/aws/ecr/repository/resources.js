// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Registry",
    group: "ECR",
    name: "default",
  },
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
