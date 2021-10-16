const assert = require("assert");
const { pipe, assign, map, omit, tap, pick } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

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
      dependsOn: ["kms::Key"],
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          pick(["retentionInDays"]),
        ]),
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
  ]);
