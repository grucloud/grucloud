exports.createResources = () => [
  {
    type: "Key",
    group: "KMS",
    name: "key-test",
    properties: ({ config }) => ({
      Policy: {
        Version: "2012-10-17",
        Id: "key-default-1",
        Statement: [
          {
            Sid: "Enable IAM User Permissions",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: "kms:*",
            Resource: `*`,
          },
          {
            Sid: "Enable KMS to be used by CloudWatch Logs",
            Effect: "Allow",
            Principal: {
              Service: `logs.${config.region}.amazonaws.com`,
            },
            Action: [
              "kms:Encrypt*",
              "kms:Decrypt*",
              "kms:ReEncrypt*",
              "kms:GenerateDataKey*",
              "kms:Describe*",
            ],
            Resource: `*`,
          },
        ],
      },
    }),
  },
];
