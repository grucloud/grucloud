const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTags } = require("./AwsTagCheck");

describe("AwsElasticIpAddress", async function () {
  let config;
  let provider;
  let eip;
  const resourceName = "myip";

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

    eip = await provider.makeElasticIpAddress({
      name: resourceName,
      properties: () => ({}),
    });

    server = await provider.makeEC2({
      name: "ec2",
      dependencies: { eip },
      properties: () => ({}),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("eip name", async function () {
    assert.equal(eip.name, resourceName);
  });
  it("eip getLive", async function () {
    await eip.getLive();
  });
  it("eip apply and destroy", async function () {
    await testPlanDeploy({ provider });
    const eipLive = await eip.getLive();

    CheckTags({
      config: provider.config(),
      tags: eipLive.Tags,
      name: eip.name,
    });

    const [eips] = await provider.listLives({ types: ["ElasticIpAddress"] });
    const resource = eips.resources[0].data;
    assert.equal(eips.type, "ElasticIpAddress");
    assert.equal(resource.Domain, "vpc");
    assert(resource.PublicIp);

    await testPlanDestroy({ provider });
  });
});
