const createResources = ({ provider }) => {
  provider.CloudWatchLogs.makeLogGroup({
    name: "my-loggroup",
  });
};

exports.createResources = createResources;
