const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AutoScalingPlans", async function () {
  it.skip("AutoScalingGroup", () =>
    pipe([
      () => ({
        groupType: "AutoScalingPlans::ScalingPlan",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
