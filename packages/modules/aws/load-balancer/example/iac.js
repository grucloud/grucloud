const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsLoadBalancer = require("@grucloud/module-aws-load-balancer");

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    configs: [ModuleAwsLoadBalancer.config, config],
  });

  const vpc = await provider.makeVpc({
    name: "vpc-elbv2-example",
    properties: () => ({
      CidrBlock: "192.168.0.0/16",
    }),
  });

  const internetGateway = await provider.makeInternetGateway({
    name: `ig-${vpc.name}`,
    dependencies: { vpc },
  });

  const subnet1 = await provider.makeSubnet({
    name: `subnet1-${vpc.name}`,
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: `${provider.config.region}a`,
    }),
  });
  const subnet2 = await provider.makeSubnet({
    name: `subnet2-${vpc.name}`,
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: `${provider.config.region}b`,
    }),
  });

  const loadBalancerResources = await ModuleAwsLoadBalancer.createResources({
    provider,
    resources: { vpc, subnets: [subnet1, subnet2] },
  });

  return {
    provider,
    resources: { loadBalancer: loadBalancerResources },
  };
};
