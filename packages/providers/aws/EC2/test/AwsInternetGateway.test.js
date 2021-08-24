const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");
const { Cli } = require("@grucloud/core/cli/cliCommands");

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

    vpc = provider.ec2.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    ig = provider.ec2.makeInternetGateway({
      name: resourceName,
      dependencies: { vpc },
    });

    await provider.start();
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
    const cli = await Cli({
      createStack: () => ({
        provider,
      }),
    });
    const result = await cli.list({
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
