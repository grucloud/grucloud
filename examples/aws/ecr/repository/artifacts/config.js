module.exports = ({ stage }) => ({
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
        },
      },
    },
  },
});
