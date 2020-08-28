const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTagsEC2 } = require("../../AwsTagCheck");

describe("AwsRouteTables", async function () {
  let config;
  let provider;
  let vpc;
  let subnet;
  let rt;
  const resourceName = "rt";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/ec2-vpc" });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });

    const { error } = await provider.destroyAll();
    assert(!error);

    const { results: lives } = await provider.listLives({ our: true });
    assert.equal(lives.length, 0);

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    subnet = await provider.makeSubnet({
      name: "subnet",
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });
    rt = await provider.makeRouteTables({
      name: resourceName,
      dependencies: { vpc, subnet },
      properties: () => ({}),
    });
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("rt name", async function () {
    assert.equal(rt.name, resourceName);
  });
  it.skip("rt getLive", async function () {
    await rt.getLive();
  });
  it.skip("rt apply and destroy", async function () {
    await testPlanDeploy({ provider });
    const rtLive = await rt.getLive();
    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();

    CheckTagsEC2({
      config: provider.config(),
      tags: rtLive.Tags,
      name: rt.name,
    });

    const {
      results: [rts],
    } = await provider.listLives({ types: ["RouteTables"] });
    const resource = rts.resources[0].data;
    assert.equal(rts.type, "RouteTables");
    //TODO
    //assert.equal(resource.Attachments[0].State, "available");
    //assert.equal(resource.Attachments[0].VpcId, vpcLive.VpcId);
    //assert(resource.RouteTablesId);
    //assert(resource.PublicIp);
    await testPlanDestroy({ provider, full: false });
  });
});
