module.exports = ({ stage, accountId }) => ({
  projectName: "aws-ecr-repository",
  ecr: {
    Repository: {
      starhackitLb: {
        name: "starhackit/lb",
        properties: {
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
                Sid: "AllowPushPull-2",
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
        },
      },
    },
    Registry: {
      default: {
        name: "default",
        properties: {
          policyText: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "stis-2",
                Effect: "Allow",
                Principal: {
                  AWS: "arn:aws:iam::840541460064:root",
                },
                Action: ["ecr:CreateRepository", "ecr:ReplicateImage"],
                Resource: "arn:aws:ecr:eu-west-2:840541460064:repository/*",
              },
            ],
          },
          replicationConfiguration: {
            rules: [
              {
                destinations: [
                  {
                    region: "us-west-1",
                    registryId: accountId(),
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
});
