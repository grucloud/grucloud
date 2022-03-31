exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "my-loggroup",
    properties: () => ({
      retentionInDays: 1,
    }),
  },
];
