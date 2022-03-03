const assert = require("assert");
const { pipe, assign, map, tap, pick } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { CloudWatchLogsGroup } = require("./CloudWatchLogsGroup");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
const GROUP = "CloudWatchLogs";

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "LogGroup",
      Client: CloudWatchLogsGroup,
      isOurMinion,
      compare: compareAws({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          pick(["retentionInDays"]),
        ]),
      }),
      filterLive: () => pipe([pick(["retentionInDays"])]),
      dependencies: {
        kmsKey: { type: "Key", group: "kms" },
      },
    },
  ]);
