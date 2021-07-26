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
  const types = ["Group", "User"];
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

    iamGroup = provider.iam.makeGroup({
      name: iamGroupName,
      properties: () => ({
        Path: "/",
      }),
    });

    iamUser = provider.iam.makeUser({
      name: userName,
      dependencies: { iamGroups: [iamGroup] },
      properties: () => ({}),
    });

    await provider.start();
  });
  after(async () => {});
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
