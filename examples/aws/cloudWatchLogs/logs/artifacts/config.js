module.exports = ({ stage }) => ({
  projectName: "aws-example-cloudwatchlogs",
  CloudWatchLogs: {
    LogGroup: {
      myLoggroup: {
        name: "my-loggroup",
      },
    },
  },
});
