const assert = require("assert");
const { map, pipe, assign } = require("rubico");

exports.config = require("./config");
exports.hooks = [];

const formatName = (name, config) => `${name}-${config.projectName}`;

const createResources = async ({ provider }) => {
  const { config } = provider;
  assert(config.vpc);
  assert(config.vpc.vpc);
  assert(config.vpc.internetGateway);
  assert(config.vpc.natGateway);
  assert(config.vpc.routeTablePublic);
  assert(config.vpc.routePublic);
  assert(config.vpc.eip);
  assert(config.vpc.subnets.publics);
  assert(config.vpc.subnets.privates);

  const vpc = await provider.makeVpc({
    name: formatName(config.vpc.vpc.name, config),
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: config.vpc.vpc.CidrBlock,
      Tags: config.vpc.vpc.Tags,
    }),
  });

  const internetGateway = await provider.makeInternetGateway({
    name: formatName(config.vpc.internetGateway.name, config),
    dependencies: { vpc },
  });

  const eip = await provider.makeElasticIpAddress({
    name: formatName(config.vpc.eip.name, config),
  });

  //Public subnets
  assert(config.vpc.subnets.publics);

  const subnetsPublic = await pipe([
    () => config.vpc.subnets.publics,
    map(({ name, CidrBlock, AvailabilityZone }) =>
      provider.makeSubnet({
        name: formatName(name, config),
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
      })
    ),
  ])();

  const routeTablePublic = await provider.makeRouteTable({
    name: formatName(config.vpc.routeTablePublic.name, config),
    dependencies: { vpc, subnets: subnetsPublic },
  });

  const routePublic = await provider.makeRoute({
    name: formatName(config.vpc.routePublic.name, config),
    dependencies: { routeTable: routeTablePublic, ig: internetGateway },
  });

  const subnet = subnetsPublic[0];
  assert(subnet);
  const natGateway = await provider.makeNatGateway({
    name: formatName(config.vpc.natGateway.name, config),
    dependencies: { subnet, eip },
  });

  //Private
  assert(config.vpc.subnets.privates);

  const privates = await pipe([
    () => config.vpc.subnets.privates,
    map(({ name, CidrBlock, AvailabilityZone, routeTableName, routeName }) =>
      pipe([
        assign({
          subnet: () =>
            provider.makeSubnet({
              name: formatName(name, config),
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
            provider.makeRouteTable({
              name: formatName(routeTableName, config),
              dependencies: { vpc, subnets: [subnet] },
            }),
        }),
        assign({
          routeNat: ({ routeTable }) =>
            provider.makeRoute({
              name: formatName(routeName, config),
              dependencies: { routeTable, natGateway },
            }),
        }),
      ])()
    ),
  ])();

  return {
    vpc,
    internetGateway,
    eip,
    natGateway,
    routeTablePublic,
    routePublic,
    privates,
    subnetsPublic,
  };
};

exports.createResources = createResources;
