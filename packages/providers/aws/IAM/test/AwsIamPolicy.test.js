const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsIamPolicy", async function () {
  let config;
  let provider;
  let iamUser;
  let iamRole;
  let iamPolicyToUser;
  let iamPolicyToRole;
  const types = ["Policy", "Role", "User"];
  const iamUserName = "alice";
  const iamRoleName = "role-example";
  const iamPolicyName = "policy-example-to-user";
  const iamPolicyNameToRole = "policy-example-to-role";

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    iamPolicyToUser = provider.iam.makePolicy({
      name: iamPolicyName,
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

    iamUser = provider.iam.makeUser({
      name: iamUserName,
      dependencies: { policies: [iamPolicyToUser] },
      properties: () => ({
        UserName: iamUserName,
        Path: "/",
      }),
    });

    iamPolicyToRole = provider.iam.makePolicy({
      name: iamPolicyNameToRole,
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

    iamRole = provider.iam.makeRole({
      name: iamRoleName,
      dependencies: { policies: [iamPolicyToRole] },

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
  after(async () => {});
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
