const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamPolicy", async function () {
  let config;
  let provider;
  let iamUser;
  let iamRole;
  let iamPolicyToUser;
  let iamPolicyToRole;
  const iamUserName = "alice";
  const iamRoleName = "role-example";
  const iamPolicyName = "policy-example-to-user";
  const iamPolicyNameToRole = "policy-example-to-role";

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

    iamRole = await provider.makeIamRole({
      name: iamRoleName,
      properties: () => ({
        Path: "/",
        AssumeRolePolicyDocument: JSON.stringify({
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
        }),
      }),
    });

    iamPolicyToUser = await provider.makeIamPolicy({
      name: iamPolicyName,
      dependencies: { iamUser },
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
    iamPolicyToRole = await provider.makeIamPolicy({
      name: iamPolicyNameToRole,
      dependencies: { iamRole },
      properties: () => ({
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
    assert.equal(iamPolicyToUser.name, iamPolicyName);

    const config = await iamPolicyToUser.resolveConfig();
    //TODO
  });
  it("iamPolicy plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 4);
  });
  it("iamPolicy listLives all", async function () {
    const { results: lives } = await provider.listLives({
      types: ["IamPolicy"],
    });
    assert(lives);
  });
  it.only("iamPolicy apply plan", async function () {
    await testPlanDeploy({ provider });

    const iamPolicyToUserLive = await iamPolicyToUser.getLive();
    assert(iamPolicyToUserLive);
    await testPlanDestroy({ provider });
  });
});
