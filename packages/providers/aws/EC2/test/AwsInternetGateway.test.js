const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("AwsInternetGateway", async function () {
  let config;
  let provider;
  let vpc;
  let ig;
  const resourceName = "ig";
  const types = ["InternetGateway"];
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

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    ig = await provider.makeInternetGateway({
      name: resourceName,
      dependencies: { vpc },
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("ig name", async function () {
    assert.equal(ig.name, resourceName);
  });
  it.skip("ig apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const igLive = await ig.getLive();
    const vpcLive = await vpc.getLive();
    assert(
      CheckAwsTags({
        config: provider.config,
        tags: igLive.Tags,
        name: ig.name,
      })
    );

    const result = await cliCommands.list({
      infra: { provider },
      commandOptions: { our: true, types },
    });
    assert(!result.error);
    assert(result.results);
    /*
    assert.equal(igs.type, "InternetGateway");
    const myIg = igs.resources.find(
      (resource) => resource.live.Attachments[0].VpcId === vpcLive.VpcId
    );
    assert(myIg);
    assert.equal(myIg.live.Attachments[0].State, "available");

    assert(myIg.live.InternetGatewayId);
    //assert(resource.PublicIp);
    */
    await testPlanDestroy({ provider, types });
  });
});
