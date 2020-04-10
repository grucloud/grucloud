const assert = require("assert");
const ScalewayProvider = require("./ScalewayProvider");
const ComputeResource = require("./resources/Compute");

const GruCloud = require("../../GruCloudApp");

const config = {
  zone: "fr-par-1",
};
//TODO
const webResourceConfig = {
  os: "ubuntu",
  machineType: "f1-micro",
};

describe("ScalewayProvider", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);

  const webResource = ComputeResource(
    { name: "web-server", provider },
    webResourceConfig
  );

  const infra = {
    providers: [provider],
    resources: [webResource],
  };
  it("list lives", async function () {
    const result = await provider.listLives();
    assert(result);
  });
  it("list targets", async function () {
    const result = await provider.listTargets();
    assert(result);
  });
  it("plan", async function () {
    // The infrastructure

    const gc = GruCloud(infra);
    const plan = await gc.plan();
    console.log(JSON.stringify(plan, null, 4));
    //assert.equal(plan.destroy.length, 0);
    //assert.equal(plan.newOrUpdate.length, 1);
  });
});
