const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsElasticIpAddress", async function () {
  let config;
  let provider;
  let eip;
  const resourceName = "myip";
  const types = ["ElasticIpAddress"];
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

    eip = await provider.makeElasticIpAddress({
      name: resourceName,
      properties: () => ({}),
    });

    server = await provider.makeEC2({
      name: "ec2",
      dependencies: { eip },
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("eip name", async function () {
    assert.equal(eip.name, resourceName);
  });
  it.skip("eip apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const eipLive = await eip.getLive();

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: eipLive.Tags,
        name: eip.name,
      })
    );

    const result = await cliCommands.list({
      infra: { provider },
      commandOptions: { our: true, types: ["ElasticIpAddress"] },
    });
    assert(!result.error);
    assert(result.results);
    //TODO
    /*
    const {
      results: [eips],
    } = await provider.listLives({ options: { types: ["ElasticIpAddress"] } });
    const resource = eips.resources[0].data;
    assert.equal(eips.type, "ElasticIpAddress");
    assert.equal(resource.Domain, "vpc");
    assert(resource.PublicIp);
*/
    await testPlanDestroy({ provider, types });
  });
});
