module.exports = ({ stage }) => ({
  projectName: "example-grucloud-infra-aws",
  CloudWatchLogs: {
    LogGroup: {
      myLoggroup: {
        name: "my-loggroup",
        properties: {
          retentionInDays: 1,
        },
      },
    },
  },
});
