const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { CloudWatchMetricAlarm } = require("./CloudWatchMetricAlarm");
const { CloudWatchDashboard } = require("./CloudWatchDashboard");
// const { CloudWatchCompositeAlarm } = require("./CloudWatchCompositeAlarm");

const GROUP = "CloudWatch";

const compareCloudWatch = compareAws({});

module.exports = pipe([
  () => [
    //
    CloudWatchDashboard({}),
    CloudWatchMetricAlarm({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        compare: compareCloudWatch({}),
      }),
    ])
  ),
]);
