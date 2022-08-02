exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: () => ({
      logGroupName: "my-loggroup",
      retentionInDays: 1,
    }),
  },
];
