const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CloudWatchCompositeAlarm } = require("./CloudWatchCompositeAlarm");
const { CloudWatchDashboard } = require("./CloudWatchDashboard");
const { CloudWatchMetricAlarm } = require("./CloudWatchMetricAlarm");
const { CloudWatchMetricStream } = require("./CloudWatchMetricStream");

const GROUP = "CloudWatch";

const compareCloudWatch = compareAws({});

module.exports = pipe([
  () => [
    //
    CloudWatchCompositeAlarm({}),
    CloudWatchDashboard({}),
    CloudWatchMetricAlarm({}),
    CloudWatchMetricStream({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compareCloudWatch({}),
      }),
    ])
  ),
]);
