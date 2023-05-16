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

const GROUP = "AutoScaling";

const { compare } = require("./AutoScalingCommon");

module.exports = pipe([
  () => [
    AutoScalingAttachment({}),
    AutoScalingAutoScalingGroup({}),
    AutoScalingLaunchConfiguration({}),
    AutoScalingNotification({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, compare: compare({}) }),
    ])
  ),
]);
