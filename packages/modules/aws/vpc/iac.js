const assert = require("assert");
const { map, pipe, assign } = require("rubico");

exports.config = require("./config");

const createResources = async ({ provider }) => {
  const { config } = provider;
  assert(config.vpc);
  assert(config.vpc.vpc);
  assert(config.vpc.internetGateway);
  assert(config.vpc.eip);
  assert(config.vpc.subnets.publics);
  assert(config.vpc.subnets.privates);

  const vpc = await provider.makeVpc({
    name: config.vpc.vpc.name,
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: config.vpc.vpc.CidrBlock,
      Tags: config.vpc.vpc.Tags,
    }),
  });

  const internetGateway = await provider.makeInternetGateway({
    name: config.vpc.internetGateway.name,
    dependencies: { vpc },
  });

  const eip = await provider.makeElasticIpAddress({
    name: config.vpc.eip.name,
  });

  //Public subnets
  assert(config.vpc.subnets.publics);

  const publics = await map(({ name, CidrBlock, AvailabilityZone }) =>
    pipe([
      assign({
        subnet: () =>
          provider.makeSubnet({
            name,
            dependencies: { vpc },
            attributes: () => ({
              MapPublicIpOnLaunch: {
                Value: true,
              },
            }),
            properties: () => ({
              CidrBlock,
              AvailabilityZone,
              Tags: config.vpc.subnets.publicTags,
            }),
          }),
      }),
      assign({
        routeTable: ({ subnet }) =>
          provider.makeRouteTables({
            name: `route-table-${subnet.name}`,
            dependencies: { vpc, subnet },
          }),
      }),
      assign({
        routeIg: ({ routeTable }) =>
          provider.makeRoute({
            name: `route-igw-${routeTable.name}`,
            dependencies: { routeTable, ig: internetGateway },
          }),
      }),
    ])()
  )(config.vpc.subnets.publics);

  const subnet = publics[0].subnet;
  const natGateway = await provider.makeNatGateway({
    name: `nat-gateway-${subnet.name}`,
    dependencies: { subnet, eip },
  });

  //Private
  assert(config.vpc.subnets.privates);

  const privates = await map(({ name, CidrBlock, AvailabilityZone }) =>
    pipe([
      assign({
        subnet: () =>
          provider.makeSubnet({
            name,
            dependencies: { vpc },
            properties: () => ({
              CidrBlock,
              AvailabilityZone,
              Tags: config.vpc.subnets.privateTags,
            }),
          }),
      }),
      assign({
        routeTable: ({ subnet }) =>
          provider.makeRouteTables({
            name: `route-table-${subnet.name}`,
            dependencies: { vpc, subnet },
          }),
      }),
      assign({
        routeNat: ({ routeTable }) =>
          provider.makeRoute({
            name: `route-nat-${routeTable.name}`,
            dependencies: { routeTable, natGateway },
          }),
      }),
    ])()
  )(config.vpc.subnets.privates);

  return {
    vpc,
    internetGateway,
    eip,
    natGateway,
    privates,
    publics,
  };
};

exports.createResources = createResources;
