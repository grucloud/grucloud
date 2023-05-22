const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { AutoScalingAttachment } = require("./AutoScalingAttachment");
const {
  AutoScalingAutoScalingGroup,
} = require("./AutoScalingAutoScalingGroup");
const {
  AutoScalingLaunchConfiguration,
} = require("./AutoScalingLaunchConfiguration");
const { AutoScalingNotification } = require("./AutoScalingNotification");
const { AutoScalingPolicy } = require("./AutoScalingPolicy");
const { AutoScalingScheduledAction } = require("./AutoScalingScheduledAction");
//const { AutoScalingWarmPool } = require("./AutoScalingWarmPool");

const GROUP = "AutoScaling";

const { compare } = require("./AutoScalingCommon");

module.exports = pipe([
  () => [
    AutoScalingAttachment({}),
    AutoScalingAutoScalingGroup({}),
    AutoScalingLaunchConfiguration({}),
    AutoScalingNotification({}),
    AutoScalingPolicy({}),
    AutoScalingScheduledAction({}),
    //AutoScalingWarmPool({})
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, compare: compare({}) }),
    ])
  ),
]);
