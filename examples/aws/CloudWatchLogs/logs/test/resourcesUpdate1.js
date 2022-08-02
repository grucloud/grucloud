exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: () => ({
      logGroupName: "my-loggroup",
      retentionInDays: 7,
      tags: {
        mytag1: "myvalue",
      },
    }),
  },
];
