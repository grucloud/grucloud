const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { CloudWatchLogsDestination } = require("./CloudWatchLogsDestination");
const {
  CloudWatchLogsDestinationPolicy,
} = require("./CloudWatchLogsDestinationPolicy");
const { CloudWatchLogsLogGroup } = require("./CloudWatchLogsLogGroup");
const { CloudWatchLogsMetricFilter } = require("./CloudWatchLogsMetricFilter");
const { CloudWatchLogsStream } = require("./CloudWatchLogsStream");
const {
  CloudWatchLogsResourcePolicy,
} = require("./CloudWatchLogsResourcePolicy");
const {
  CloudWatchLogsQueryDefinition,
} = require("./CloudWatchLogsQueryDefinition");
const {
  CloudWatchLogsSubscriptionFilter,
} = require("./CloudWatchLogsSubscriptionFilter");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
const GROUP = "CloudWatchLogs";
const tagsKey = "tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    CloudWatchLogsDestination({ compare }),
    CloudWatchLogsDestinationPolicy({ compare }),
    CloudWatchLogsLogGroup({ compare }),
    CloudWatchLogsMetricFilter({ compare }),
    CloudWatchLogsQueryDefinition({ compare }),
    CloudWatchLogsResourcePolicy({ compare }),
    CloudWatchLogsStream({ compare }),
    CloudWatchLogsSubscriptionFilter({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
