exports.createResources = () => [
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "my-queue",
      Tags: {
        "my-tag-1": "my-valueNew",
        "my-tag-2": "my-value-1",
      },
    }),
  },
];
