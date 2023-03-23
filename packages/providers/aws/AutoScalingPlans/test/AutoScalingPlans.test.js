const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AutoScalingPlans", async function () {
  it("ScalingPlan", () =>
    pipe([
      () => ({
        groupType: "AutoScalingPlans::ScalingPlan",
        livesNotFound: ({ config }) => [
          { ScalingPlanName: "sp-123", ScalingPlanVersion: 1 },
        ],
      }),
      awsResourceTest,
    ])());
});
