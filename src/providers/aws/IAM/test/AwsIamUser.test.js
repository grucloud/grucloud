const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamUser", async function () {
  let config;
  let provider;
  let iamUser;
  const iamUserName = "Alice";
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config: config.aws,
    });

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");

    iamUser = await provider.makeIamUser({
      name: iamUserName,
      properties: () => ({
        UserName: iamUserName,
        Path: "/",
      }),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("iamUser resolveConfig", async function () {
    assert.equal(iamUser.name, iamUserName);

    const config = await iamUser.resolveConfig();
    //TODO
    //assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });
  it("iamUser plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it("iamUser listLives all", async function () {
    const { results: lives } = await provider.listLives({ types: ["IamUser"] });
    assert(lives);
  });
  it("iamUser apply plan", async function () {
    await testPlanDeploy({ provider });

    const iamUserLive = await iamUser.getLive();
    assert(iamUserLive);
    await testPlanDestroy({ provider });
  });
});
