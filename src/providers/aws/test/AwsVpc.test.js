const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTags } = require("./AwsTagCheck");
describe("AwsVpc", async function () {
  let provider;
  let vpc;

  before(async function () {
    try {
      provider = await AwsProvider({
        name: "aws",
        config: ConfigLoader({ baseDir: __dirname }),
      });
      const { success } = await provider.destroyAll();
      assert(success);

      const lives = await provider.listLives({ our: true });
      assert.equal(lives.length, 0);

      vpc = provider.makeVpc({
        name: "vpc",
        properties: {
          CidrBlock: "10.1.1.1/16",
        },
      });
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("vpc name", async function () {
    assert.equal(vpc.name, "vpc");
  });
  it("vpc getLive", async function () {
    const live = await vpc.getLive();
  });
  it("vpc listLives", async function () {
    const [vpcs] = await provider.listLives({ types: ["Vpc"] });
    assert(vpcs);
    const vpcDefault = vpcs.resources.find((vpc) => vpc.data.IsDefault);
    assert(vpcDefault);
  });

  it.only("deploy plan", async function () {
    await testPlanDeploy({ provider });
    const vpcLive = await vpc.getLive();

    CheckTags({ config: provider.config, tags: vpcLive.Tags, name: vpc.name });

    await testPlanDestroy({ provider });
  });
});
