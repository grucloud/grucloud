const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/test/E2ETestUtils");

describe("AwsNatGateway", async function () {
  let config;
  let provider;
  let vpc;
  let ig;
  let subnet;
  let eip;
  let natGateway;
  let routeTable;

  const types = [
    "Vpc",
    "Subnet",
    "RouteTable",
    "RouteTables",
    "NatGateway",
    "InternetGateway",
    "ElasticIpAddress",
  ];
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    ig = await provider.makeInternetGateway({
      name: "ig",
      dependencies: { vpc },
    });

    subnet = await provider.makeSubnet({
      name: "public",
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });

    eip = await provider.makeElasticIpAddress({
      name: "myip",
    });

    natGateway = await provider.makeNatGateway({
      name: "nat-gateway",
      dependencies: { subnet, eip },
    });

    routeTable = await provider.makeRouteTables({
      name: "route-table-nat-gateway",
      dependencies: { vpc, subnet },
    });

    routeNatGateway = await provider.makeRoute({
      name: "route-nat-gateway",
      dependencies: { routeTable, natGateway },
    });
  });

  it.skip("nat apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const natGatewayLive = await natGateway.getLive();

    await testPlanDestroy({ provider, types });
  });
});
