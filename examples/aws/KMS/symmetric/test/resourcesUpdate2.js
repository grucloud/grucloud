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
            Resource: "*",
          },
        ],
      },
      Tags: [{ Key: "mykey-new", Value: "value" }],
    }),
  },
];
