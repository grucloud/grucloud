const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

const testName = "rt";

const buildName = (name) => `${testName}-${name}`;
describe.skip("AwsRouteTable", async function () {
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
      await testPlanDestroy({ provider });
    } catch (error) {
      throw error;
    }
  });
});
