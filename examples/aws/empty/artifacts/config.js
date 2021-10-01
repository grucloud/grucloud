module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-template",
  CloudWatchLogs: {
    LogGroup: {
      myLoggroup: {
        name: "my-loggroup",
      },
    },
  },
});
