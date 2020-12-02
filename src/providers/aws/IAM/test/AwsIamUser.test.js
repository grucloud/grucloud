const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamUser", async function () {
  let config;
  let provider;
  let iamUser;
  const types = ["IamUser"];
  const iamUserName = "Alice";
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

    iamUser = await provider.makeIamUser({
      name: iamUserName,
      properties: () => ({
        UserName: iamUserName,
        Path: "/",
      }),
    });
  });
  after(async () => {});
  it("iamUser resolveConfig", async function () {
    assert.equal(iamUser.name, iamUserName);
    const config = await iamUser.resolveConfig();
    assert(config.UserName);
    assert(config.Path);
  });
  it.skip("iamUser apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 2, destroy: 0 },
    });

    const iamUserLive = await iamUser.getLive();
    assert(iamUserLive);
    await testPlanDestroy({ provider, types });
  });
});
