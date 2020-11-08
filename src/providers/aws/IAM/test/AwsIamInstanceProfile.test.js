const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("AwsIamInstanceProfile", async function () {
  let config;
  let provider;
  let iamRole;
  let iamInstanceProfile;
  const iamRoleName = "role-example-for-instance-profile";
  const iamInstanceProfileName = "instance-profile-example";

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

    iamInstanceProfile = await provider.makeIamInstanceProfile({
      name: iamInstanceProfileName,
      dependencies: { iamRoles: [iamRole] },
      properties: () => ({
        Path: "/",
      }),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("iamInstanceProfile resolveConfig", async function () {
    assert.equal(iamInstanceProfile.name, iamInstanceProfileName);
    const config = await iamInstanceProfile.resolveConfig();
    assert(config.InstanceProfileName);
    assert(config.Path);
  });
  it("iamInstanceProfile plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 2);
  });
  it("iamInstanceProfile listLives all", async function () {
    const { results: lives } = await provider.listLives({
      types: ["IamInstanceProfile"],
    });
    assert(lives);
  });
  it("iamInstanceProfile apply plan", async function () {
    await testPlanDeploy({ provider });

    const iamInstanceProfileLive = await iamInstanceProfile.getLive();
    assert(iamInstanceProfileLive);
    assert.equal(iamInstanceProfileLive.Roles[0].RoleName, iamRole.name);

    await testPlanDestroy({ provider });
  });
});
