const assert = require("assert");
const { pipe, assign, map, tap, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinionObject } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { CloudWatchLogsGroup } = require("./CloudWatchLogsGroup");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
const GROUP = "CloudWatchLogs";
const tagsKey = "tags";

const compareCloudWatchLog = compareAws({ tagsKey: "tags" });

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = pipe([
  () => [
    {
      type: "LogGroup",
      Client: CloudWatchLogsGroup,
      compare: compareCloudWatchLog({
        filterAll: () => pipe([pick(["retentionInDays"])]),
      }),
      filterLive: () => pipe([pick(["retentionInDays"])]),
      dependencies: {
        kmsKey: { type: "Key", group: "kms" },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
