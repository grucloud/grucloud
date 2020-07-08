const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTags } = require("./AwsTagCheck");

describe("AwsInternetGateway", async function () {
  let config;
  let provider;
  let vpc;
  let ig;
  const resourceName = "ig";

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config: ConfigLoader({ baseDir: __dirname }),
    });

    const { success } = await provider.destroyAll();
    assert(success);

    const lives = await provider.listLives({ our: true });
    assert.equal(lives.length, 0);

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    ig = await provider.makeInternetGateway({
      name: resourceName,
      dependencies: { vpc },
      properties: () => ({}),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("ig name", async function () {
    assert.equal(ig.name, resourceName);
  });
  it("ig getLive", async function () {
    await ig.getLive();
  });
  it("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    const igLive = await ig.getLive();
    const vpcLive = await vpc.getLive();
    CheckTags({
      config: provider.config(),
      tags: igLive.Tags,
      name: ig.name,
    });

    const [igs] = await provider.listLives({ types: ["InternetGateway"] });
    const resource = igs.resources[0].data;
    assert.equal(igs.type, "InternetGateway");
    assert.equal(resource.Attachments[0].State, "available");
    assert.equal(resource.Attachments[0].VpcId, vpcLive.VpcId);
    assert(resource.InternetGatewayId);
    //assert(resource.PublicIp);
    await testPlanDestroy({ provider });
  });
});
