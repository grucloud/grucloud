const createResources = ({ provider }) => {
  provider.CloudWatchLogs.makeLogGroup({
    name: "my-loggroup",
    properties: () => ({
      retentionInDays: 7,
    }),
  });
};

exports.createResources = createResources;
