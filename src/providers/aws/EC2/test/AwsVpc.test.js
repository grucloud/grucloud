const assert = require("assert");
const AWS = require("aws-sdk");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");
const logger = require("../../../../logger")({ prefix: "AwsVpc" });
const { tos } = require("../../../../tos");

describe("AwsVpc", async function () {
  const types = ["Vpc"];
  let config;
  let provider;
  let vpc;

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

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.0.0.0/16",
      }),
    });
  });
  after(async () => {});
  it("vpc name", async function () {
    assert.equal(vpc.name, "vpc");
  });
  it("vpc getLive", async function () {
    const live = await vpc.getLive();
  });
  it("vpc listLives", async function () {
    const {
      results: [vpcs],
    } = await provider.listLives({ types });
    assert(vpcs);
    const vpcDefault = vpcs.resources.find((vpc) => vpc.data.IsDefault);
    assert(vpcDefault);
  });
  it("vpc listLives canBeDeleted", async function () {
    const { results } = await provider.listLives({
      types,
      canBeDeleted: true,
    });
    assert(isEmpty(results));
  });

  it.skip("vpc apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const vpcLive = await vpc.getLive();
    const { VpcId } = vpcLive;

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: vpcLive.Tags,
        name: vpc.name,
      })
    );

    await testPlanDestroy({ provider, full: false });
  });
});
