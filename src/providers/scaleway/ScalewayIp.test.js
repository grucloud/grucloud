const assert = require("assert");
const ScalewayProvider = require("./ScalewayProvider");

const config = {
  zone: "fr-par-1",
  organization: process.env.SCALEWAY_ORGANISATION_ID,
};

describe("ScalewayIp", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);

  const ip = provider.makeIp({ name: "myip" }, ({}) => ({}));

  it("ip config", async function () {
    const config = await ip.config();
    assert(config);
  });

  it.only("plan", async function () {
    const plan = await provider.plan();
    await provider.deployPlan(plan);

    {
      const emptyPlan = await provider.plan();
      assert.equal(emptyPlan.destroy.length, 0);
      assert.equal(emptyPlan.newOrUpdate.length, 0);
    }
    //console.log(JSON.stringify(plan, null, 4));
  });
});
