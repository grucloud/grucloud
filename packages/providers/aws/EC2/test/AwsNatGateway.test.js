const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

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
    "RouteTable",
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

    vpc = provider.ec2.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    ig = provider.ec2.makeInternetGateway({
      name: "ig",
      dependencies: { vpc },
    });

    subnet = provider.ec2.makeSubnet({
      name: "public",
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });

    eip = provider.ec2.makeElasticIpAddress({
      name: "myip",
    });

    natGateway = provider.ec2.makeNatGateway({
      name: "nat-gateway",
      dependencies: { subnet, eip },
    });

    routeTable = provider.ec2.makeRouteTable({
      name: "route-table-nat-gateway",
      dependencies: { vpc, subnets: [subnet] },
    });

    routeNatGateway = provider.ec2.makeRoute({
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
