const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

const { AwsAutoScalingGroup } = require("../AwsAutoScalingGroup");

describe("AwsAutoScalingGroup", async function () {
  let config;
  let provider;
  let autoSg;
  const types = ["AutoScalingGroup"];

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    await provider.start();
    autoSg = AwsAutoScalingGroup({ config: provider.config });
  });
  after(async () => {});
  it("delete with invalid id", async function () {
    await autoSg.destroy({ live: { AutoScalingGroupName: "TOTO" } });
  });
});
