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
  const types = ["IamPolicy", "IamRole", "IamUser"];
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
    provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

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

    iamPolicyToUser = await provider.makeIamPolicy({
      name: iamPolicyName,
      dependencies: { iamUser },
      properties: () => ({
        PolicyName: iamPolicyName,
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: ["ec2:Describe*"],
              Effect: "Allow",
              Resource: "*",
            },
          ],
        },
        Description: "Allow ec2:Describe",
        Path: "/",
      }),
    });
    iamPolicyToRole = await provider.makeIamPolicy({
      name: iamPolicyNameToRole,
      dependencies: { iamRole },
      properties: () => ({
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: ["ec2:Describe*"],
              Effect: "Allow",
              Resource: "*",
            },
          ],
        },
        Description: "Allow ec2:Describe",
        Path: "/",
      }),
    });
  });
  after(async () => {});
  it("iamPolicy resolveConfig", async function () {
    assert.equal(iamPolicyToUser.name, iamPolicyName);
    const config = await iamPolicyToUser.resolveConfig();
    //TODO
  });
  it.skip("iamPolicy apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 2, destroy: 0 },
    });

    const iamPolicyToUserLive = await iamPolicyToUser.getLive();
    assert(iamPolicyToUserLive);
    await testPlanDestroy({ provider, types });
  });
});
