const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsIamGroup", async function () {
  let config;
  let provider;
  let iamGroup;
  let iamUser;
  const types = ["IamGroup", "IamUser"];
  const userName = "Bob";
  const iamGroupName = "Admin";

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

    await provider.start();

    iamGroup = await provider.iam.makeIamGroup({
      name: iamGroupName,
      properties: () => ({
        Path: "/",
      }),
    });

    iamUser = await provider.iam.makeIamUser({
      name: userName,
      dependencies: { iamGroups: [iamGroup] },
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("iamGroup resolveConfig", async function () {
    assert.equal(iamGroup.name, iamGroupName);
    const config = await iamGroup.resolveConfig();
    assert.equal(config.GroupName, iamGroupName);
  });
  it.skip("iamGroup apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 2, destroy: 0 },
    });

    const iamGroupLive = await iamGroup.getLive();
    assert(iamGroupLive);

    const iamUserLive = await iamUser.getLive();
    assert.equal(iamGroup.name, iamUserLive.Groups[0]);
    await testPlanDestroy({ provider, types });
  });
});
