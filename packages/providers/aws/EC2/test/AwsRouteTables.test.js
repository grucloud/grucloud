const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("AwsRouteTables", async function () {
  let config;
  let provider;
  let vpc;
  let subnet;
  let routeTable;

  let routeIg;
  const resourceName = "route-table";

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

    routeTable = await provider.makeRouteTables({
      name: resourceName,
      dependencies: { vpc, subnet },
    });

    routeIg = await provider.makeRoute({
      name: "route-ig",
      dependencies: { routeTable, ig },
    });
  });
  after(async () => {});
  it.skip("rt apply and destroy", async function () {
    await testPlanDeploy({ provider });
    const rtLive = await routeTable.getLive();
    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: rtLive.Tags,
        name: routeTable.name,
      })
    );

    const result = await cliCommands.list({
      infra: { provider },
      commandOptions: { our: true, types: ["RouteTables"] },
    });
    assert(!result.error);
    assert(result.results);
    /*
    const {
      results: [rts],
    } = await provider.listLives({ options: { types: ["RouteTables"] } });
    assert.equal(rts.type, "RouteTables");
    {
      const { data: routeTable } = rts.resources.find(
        (resource) => resource.managedByUs
      );
      assert.equal(routeTable.Associations[0].SubnetId, subnetLive.SubnetId);
      assert.equal(routeTable.VpcId, vpcLive.VpcId);
    }*/
    await testPlanDestroy({ provider });
  });
});
