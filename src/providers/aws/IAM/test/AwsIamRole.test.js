const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamRole", async function () {
  let config;
  let provider;
  let iamRole;
  const types = ["IamRole"];
  const iamRoleName = "role-example";
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

    iamRole = await provider.makeIamRole({
      name: iamRoleName,
      properties: () => ({
        Path: "/",
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "sts:AssumeRole",
              Principal: {
                Service: "ec2.amazonaws.com",
              },
              Effect: "Allow",
              Sid: "",
            },
          ],
        },
      }),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("iamRole resolveConfig", async function () {
    assert.equal(iamRole.name, iamRoleName);
    const config = await iamRole.resolveConfig();
  });
  it("iamRole listLives all", async function () {
    const { results: lives } = await provider.listLives({ types });
    assert(lives);
  });
  it.skip("iamRole apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 1, destroy: 0 },
    });

    const iamRoleLive = await iamRole.getLive();
    assert(iamRoleLive);
    await testPlanDestroy({ provider, types });
  });
});
