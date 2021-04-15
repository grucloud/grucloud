const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsIamPolicyReadOnly", async function () {
  let config;
  let provider;
  const types = ["IamPolicyReadOnly"];

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();
  });
  after(async () => {});
  it("iamPolicy resolveConfig", async function () {
    const policyArn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy";
    const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
      name: "AmazonEKSClusterPolicy",
      properties: () => ({
        Arn: policyArn,
      }),
    });

    await testPlanDeploy({ provider, types });
    const policy = await iamPolicyEKSCluster.getLive();
    assert.equal(policy.Arn, policyArn);
    await testPlanDestroy({ provider, types });
    //TODO
  });
});
