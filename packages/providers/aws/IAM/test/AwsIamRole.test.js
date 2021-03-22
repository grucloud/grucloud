const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/test/E2ETestUtils");

describe("AwsIamRole", async function () {
  let config;
  let provider;
  let iamRole;
  const types = ["IamRole"];
  const iamRoleName = "role-example";
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
  after(async () => {});
  it("iamRole resolveConfig", async function () {
    assert.equal(iamRole.name, iamRoleName);
    const config = await iamRole.resolveConfig();
  });
  it.skip("iamRole apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 1, destroy: 0 },
    });

    const iamRoleLive = await iamRole.getLive();
    assert(iamRoleLive);
    assert(iamRoleLive.AssumeRolePolicyDocument.Version);
    await testPlanDestroy({ provider, types });
  });
});
