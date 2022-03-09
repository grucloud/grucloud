exports.createResources = () => [
  {
    type: "Queue",
    group: "SQS",
    name: "my-queue",
    properties: ({}) => ({
      tags: {
        "my-tag-1": "my-valueNew",
        "my-tag-2": "my-value-1",
      },
    }),
  },
];
