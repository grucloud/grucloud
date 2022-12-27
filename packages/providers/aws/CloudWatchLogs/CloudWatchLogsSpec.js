const assert = require("assert");
const { pipe, get, map, tap, pick } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { isOurMinionObject } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { CloudWatchLogGroup } = require("./CloudWatchLogsGroup");
const { CloudWatchLogStream } = require("./CloudWatchLogStream");
const {
  CloudWatchSubscriptionFilter,
} = require("./CloudWatchSubscriptionFilter");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
const GROUP = "CloudWatchLogs";
const tagsKey = "tags";

const compare = compareAws({ tagsKey });

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = pipe([
  () => [
    CloudWatchLogGroup({ compare }),
    CloudWatchLogStream({ compare }),
    CloudWatchSubscriptionFilter({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        isOurMinion,
        compare: compare({}),
      }),
    ])
  ),
]);
