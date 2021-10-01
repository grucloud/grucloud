const createResources = ({ provider }) => {
  provider.CloudWatchLogs.makeLogGroup({
    name: "my-loggroup",
    properties: () => ({
      retentionInDays: 1,
    }),
  });
};

exports.createResources = createResources;
