const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "AutoScalingPlans";

const compare = compareAws({});

// const {
//   AutoScalingPlansScalingPlan,
// } = require("./AutoScalingPlansScalingPlan");

module.exports = pipe([
  () => [
    //
    //AutoScalingPlansScalingPlan({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
