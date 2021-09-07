module.exports = ({ stage }) => ({
  projectName: "example-grucloud-sqs-queue",
  SQS: {
    Queue: {
      myQueue: {
        name: "my-queue",
        properties: {
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
        },
      },
    },
  },
});
