const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  AutoScalingAutoScalingGroup,
} = require("../AutoScalingAutoScalingGroup");

describe("AutoScalingAutoScalingGroup", async function () {
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
    autoSg = AutoScalingAutoScalingGroup({ config: provider.config });
    await provider.start();
  });
  after(async () => {});
  it("delete with invalid id", async function () {
    await autoSg.destroy({ live: { AutoScalingGroupName: "TOTO" } });
  });
});
