const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");

describe("AutoScalingAutoScalingGroup", async function () {
  let config;
  let provider;
  let autoSg;
  const types = ["AutoScalingGroup"];

  before(async function () {
    provider = AwsProvider({ config });
    autoSg = provider.getClient({ groupType: "AutoScaling::AutoScalingGroup" });
    await provider.start();
  });
  after(async () => {});
  it("delete with invalid id", async function () {
    await autoSg.destroy({ live: { AutoScalingGroupName: "TOTO" } });
  });
});
