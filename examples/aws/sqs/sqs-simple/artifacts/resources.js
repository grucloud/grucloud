// Generated by 'gc gencode'
const createResources = ({ provider }) => {
  provider.SQS.makeQueue({
    name: "my-queue",
    properties: ({ config }) => ({
      Attributes: {
        VisibilityTimeout: "30",
        MaximumMessageSize: "262144",
        MessageRetentionPeriod: "345600",
        DelaySeconds: "0",
        ReceiveMessageWaitTimeSeconds: "0",
      },
      tags: {
        "my-tag": "my-value",
      },
    }),
  });
};

exports.createResources = createResources;
