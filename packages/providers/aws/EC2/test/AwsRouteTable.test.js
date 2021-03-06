const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");
const cliCommands = require("@grucloud/core/cli/cliCommands");

const testName = "rt";

const buildName = (name) => `${testName}-${name}`;
describe("AwsRouteTable", async function () {
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

    vpc = provider.ec2.makeVpc({
      name: buildName("vpc"),
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    subnet = provider.ec2.makeSubnet({
      name: buildName("subnet"),
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });

    ig = provider.ec2.makeInternetGateway({
      name: buildName("ig"),
      dependencies: { vpc },
    });

    routeTable = provider.ec2.makeRouteTable({
      name: buildName(resourceName),
      dependencies: { vpc, subnets: [subnet] },
    });

    routeIg = provider.ec2.makeRoute({
      name: buildName("route-ig"),
      dependencies: { routeTable, ig },
    });

    await provider.start();
  });
  after(async () => {});
  it("rt apply and destroy", async function () {
    try {
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
        commandOptions: { our: true, types: ["RouteTable"] },
      });
      assert(!result.error);
      assert(result.results);
      /*
    const {
      results: [rts],
    } = provider.listLives({ options: { types: ["RouteTable"] } });
    assert.equal(rts.type, "RouteTable");
    {
      const { data: routeTable } = rts.resources.find(
        (resource) => resource.managedByUs
      );
      assert.equal(routeTable.Associations[0].SubnetId, subnetLive.SubnetId);
      assert.equal(routeTable.VpcId, vpcLive.VpcId);
    }*/
      await testPlanDestroy({ provider });
    } catch (error) {
      throw error;
    }
  });
});
