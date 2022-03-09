exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "my-loggroup",
    properties: () => ({
      retentionInDays: 7,
      tags: {
        mytag1: "myvalue",
      },
    }),
  },
];
