const assert = require("assert");
const { pipe, get, map, tap, pick } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
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
      pickPropertiesCreate: ["retentionInDays"],
      // ignoreResource: () =>
      //   pipe([get("name"), callProp("startsWith", "/aws/")]),
      //TODO
      compare: compareCloudWatchLog({
        filterAll: () => pipe([pick(["retentionInDays"])]),
      }),
      // TODO use propertiesCreate ?
      filterLive: () => pipe([pick(["retentionInDays"])]),
      dependencies: {
        kmsKey: { type: "Key", group: "KMS" },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      isOurMinion,
      compare: compareCloudWatchLog({}),
    })
  ),
]);
