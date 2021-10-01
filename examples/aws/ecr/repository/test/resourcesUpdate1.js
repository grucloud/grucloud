const createResources = ({ provider }) => {
  provider.ECR.makeRegistry({
    name: "default",
    properties: ({ config }) => ({
      policyText: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "stis-1",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: ["ecr:CreateRepository", "ecr:ReplicateImage"],
            Resource: `arn:aws:ecr:${
              config.region
            }:${config.accountId()}:repository/*`,
          },
        ],
      },
      replicationConfiguration: {
        rules: [
          {
            destinations: [
              {
                region: "us-east-1",
                registryId: config.accountId(),
              },
            ],
          },
        ],
      },
    }),
  });

  provider.ECR.makeRepository({
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
            description: "Expire images older than 15 days",
            selection: {
              tagStatus: "untagged",
              countType: "sinceImagePushed",
              countUnit: "days",
              countNumber: 15,
            },
            action: {
              type: "expire",
            },
          },
        ],
      },
    }),
  });
};

exports.createResources = createResources;
