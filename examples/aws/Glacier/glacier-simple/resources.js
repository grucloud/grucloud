// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vault",
    group: "Glacier",
    properties: ({ config }) => ({
      policy: {
        Policy: {
          Statement: [
            {
              Action: ["glacier:InitiateJob", "glacier:GetJobOutput"],
              Effect: "Allow",
              Principal: "*",
              Resource: `arn:aws:glacier:${
                config.region
              }:${config.accountId()}:vaults/my-vault`,
              Sid: "add-read-only-perm",
            },
          ],
          Version: "2012-10-17",
        },
      },
      vaultName: "my-vault",
      vaultNotificationConfig: {
        Events: ["ArchiveRetrievalCompleted", "InventoryRetrievalCompleted"],
      },
    }),
    dependencies: ({}) => ({
      snsTopic: "topic-glacier",
    }),
  },
  { type: "Topic", group: "SNS", name: "topic-glacier" },
];
