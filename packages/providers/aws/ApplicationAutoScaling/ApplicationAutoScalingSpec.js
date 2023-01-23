const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  ApplicationAutoScalingPolicy,
} = require("./ApplicationAutoScalingPolicy");

const {
  ApplicationAutoScalingTarget,
} = require("./ApplicationAutoScalingTarget");

const GROUP = "ApplicationAutoScaling";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    ApplicationAutoScalingPolicy({}),
    ApplicationAutoScalingTarget({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
