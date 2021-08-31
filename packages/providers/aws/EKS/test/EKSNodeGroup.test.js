const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

describe("EKSNodeGroup", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});
  it.skip("getById invalid clusterName", async function () {
    const nodeGroup = provider.getClient({ groupType: "EKS::NodeGroup" });
    const result = await nodeGroup.getById({
      clusterName: "aaa",
      nodegroupName: "xxx",
    });
    assert(!result);
  });
});
