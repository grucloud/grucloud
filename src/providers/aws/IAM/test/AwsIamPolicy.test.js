const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamPolicy", async function () {
  let config;
  let provider;
  let iamPolicy;
  const iamPolicyName = "policy-example-3";

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

    iamPolicy = await provider.makeIamPolicy({
      name: iamPolicyName,
      properties: () => ({
        PolicyName: iamPolicyName,
        PolicyDocument: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: ["ec2:Describe*"],
              Effect: "Allow",
              Resource: "*",
            },
          ],
        }),
        Description: "Allow ec2:Describe",
        Path: "/",
      }),
    });
  });
  after(async () => {
    // await provider?.destroyAll();
  });
  it("iamPolicy resolveConfig", async function () {
    assert.equal(iamPolicy.name, iamPolicyName);

    const config = await iamPolicy.resolveConfig();
  });
  it("iamPolicy plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it("iamPolicy listLives all", async function () {
    const { results: lives } = await provider.listLives({
      types: ["IamPolicy"],
    });
    assert(lives);
  });
  it("iamPolicy apply plan", async function () {
    await testPlanDeploy({ provider });

    const iamPolicyLive = await iamPolicy.getLive();
    assert(iamPolicyLive);
    await testPlanDestroy({ provider });
  });
});
