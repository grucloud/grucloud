const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsIamInstanceProfile", async function () {
  let config;
  let provider;
  let iamRole;
  let iamInstanceProfile;
  const types = ["InstanceProfile", "Role"];
  const iamRoleName = "role-example-for-instance-profile";
  const iamInstanceProfileName = "instance-profile-example";

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

    iamRole = provider.IAM.makeRole({
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

    iamInstanceProfile = provider.IAM.makeInstanceProfile({
      name: iamInstanceProfileName,
      dependencies: { roles: [iamRole] },
      properties: () => ({
        Path: "/",
      }),
    });

    await provider.start();
  });
  after(async () => {});
  it.skip("iamInstanceProfile apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 2, destroy: 0 },
    });

    await testPlanDestroy({ provider, types });
  });
});
