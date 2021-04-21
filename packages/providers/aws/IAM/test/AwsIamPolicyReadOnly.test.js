const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const formatName = (name) => `${name}-test-policy-read-only`;
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
  it("iamPolicy read only", async function () {
    const policyArn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy";
    const iamPolicyEKSCluster = await provider.useIamPolicy({
      name: "AmazonEKSClusterPolicy",
      properties: () => ({
        Arn: policyArn,
      }),
    });

    const policy = await iamPolicyEKSCluster.getLive();
    assert(policy);

    const roleCluster = await provider.makeIamRole({
      name: formatName("role-cluster"),
      dependencies: {
        policies: [iamPolicyEKSCluster],
      },
      properties: () => ({
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: "eks.amazonaws.com",
              },
              Action: "sts:AssumeRole",
            },
          ],
        },
      }),
    });
    await testPlanDeploy({ provider, types });
    assert.equal(policy.Arn, policyArn);
    await testPlanDestroy({ provider, types });
    //TODO
  });
});
