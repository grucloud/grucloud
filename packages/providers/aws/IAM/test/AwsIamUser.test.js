const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsIamUser", async function () {
  let config;
  let provider;
  let iamUser;
  const types = ["IamUser"];
  const iamUserName = "Alice";
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });

    iamUser = provider.iam.makeUser({
      name: iamUserName,
      properties: () => ({
        UserName: iamUserName,
        Path: "/",
      }),
    });
    await provider.start();
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
