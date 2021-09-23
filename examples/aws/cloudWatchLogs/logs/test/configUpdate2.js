module.exports = ({ stage }) => ({
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
