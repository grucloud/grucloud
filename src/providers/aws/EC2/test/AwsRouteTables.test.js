const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsRouteTables", async function () {
  let config;
  let provider;
  let vpc;
  let subnet;
  let rt;
  const resourceName = "rt";

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
        CidrBlock: "10.1.0.1/16",
      }),
    });
    subnet = await provider.makeSubnet({
      name: "subnet",
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });
    ig = await provider.makeInternetGateway({
      name: "ig",
      dependencies: { vpc },
    });
    rt = await provider.makeRouteTables({
      name: resourceName,
      dependencies: { vpc, subnet, ig },
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("rt name", async function () {
    assert.equal(rt.name, resourceName);
  });
  it.skip("rt getLive", async function () {
    await rt.getLive();
  });
  it.skip("rt apply and destroy", async function () {
    await testPlanDeploy({ provider });
    const rtLive = await rt.getLive();
    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: rtLive.Tags,
        name: rt.name,
      })
    );

    const {
      results: [rts],
    } = await provider.listLives({ types: ["RouteTables"] });
    assert.equal(rts.type, "RouteTables");

    const { data: routeTable } = rts.resources.find(
      (resource) => resource.managedByUs
    );
    assert(routeTable);
    assert.equal(routeTable.Associations[0].SubnetId, subnetLive.SubnetId);
    assert.equal(routeTable.VpcId, vpcLive.VpcId);

    await testPlanDestroy({ provider });
  });
});
