const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamGroup", async function () {
  let config;
  let provider;
  let iamGroup;
  let iamUser;
  const userName = "Bob";
  const iamGroupName = "Admin";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");

    iamGroup = await provider.makeIamGroup({
      name: iamGroupName,
      properties: () => ({
        Path: "/",
      }),
    });

    iamUser = await provider.makeIamUser({
      name: userName,
      dependencies: { iamGroups: [iamGroup] },
      properties: () => ({}),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("iamGroup resolveConfig", async function () {
    assert.equal(iamGroup.name, iamGroupName);
    const config = await iamGroup.resolveConfig();
    assert.equal(config.GroupName, iamGroupName);
  });
  it("iamGroup plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 2);
  });
  it("iamGroup listLives all", async function () {
    const { results: lives } = await provider.listLives({
      types: ["IamGroup"],
    });
    assert(lives);
  });
  it("iamGroup apply plan", async function () {
    await testPlanDeploy({ provider });

    const iamGroupLive = await iamGroup.getLive();
    assert(iamGroupLive);

    const iamUserLive = await iamUser.getLive();
    assert.equal(iamGroup.name, iamUserLive.Groups[0]);
    await testPlanDestroy({ provider });
  });
});
