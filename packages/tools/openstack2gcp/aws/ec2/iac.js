// Generated by aws2gc
const { set, pipe } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = async ({ provider }) => {
  const { config } = provider;

  provider.ec2.makeVpc({
    name: config.ec2.Vpc.vpcEc2Example.name,
    properties: () => config.ec2.Vpc.vpcEc2Example.properties,
  });

  provider.ec2.useDefaultVpc({
    name: config.ec2.Vpc.vpcDefault.name,
  });

  provider.ec2.makeSubnet({
    name: config.ec2.Subnet.subnet.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcEc2Example,
    }),
    properties: () => config.ec2.Subnet.subnet.properties,
  });

  provider.ec2.makeKeyPair({
    name: config.ec2.KeyPair.kp.name,
    properties: () => config.ec2.KeyPair.kp.properties,
  });

  provider.ec2.makeVolume({
    name: config.ec2.Volume.volume.name,
    properties: () => config.ec2.Volume.volume.properties,
  });

  provider.ec2.useVolume({
    name: config.ec2.Volume.vol_06724d6a9e89eb755.name,
    properties: () => config.ec2.Volume.vol_06724d6a9e89eb755.properties,
  });

  provider.ec2.makeElasticIpAddress({
    name: config.ec2.ElasticIpAddress.myip.name,
  });

  provider.ec2.makeInternetGateway({
    name: config.ec2.InternetGateway.ig.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcEc2Example,
    }),
  });

  provider.ec2.makeRouteTable({
    name: config.ec2.RouteTable.routeTable.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcEc2Example,
      subnets: [resources.ec2.Subnet.subnet],
    }),
  });

  provider.ec2.makeRoute({
    name: config.ec2.Route.routeIg.name,
    dependencies: ({ resources }) => ({
      routeTable: resources.ec2.RouteTable.routeTable,
      ig: resources.ec2.InternetGateway.ig,
    }),
    properties: () => config.ec2.Route.routeIg.properties,
  });

  provider.ec2.makeSecurityGroup({
    name: config.ec2.SecurityGroup.securityGroup.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcEc2Example,
    }),
    properties: () => config.ec2.SecurityGroup.securityGroup.properties,
  });

  provider.ec2.useDefaultSecurityGroup({
    name: config.ec2.SecurityGroup.sgDefaultVpcEc2Example.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcEc2Example,
    }),
  });

  provider.ec2.useDefaultSecurityGroup({
    name: config.ec2.SecurityGroup.sgDefaultVpcDefault.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcDefault,
    }),
  });

  provider.ec2.makeSecurityGroupRuleIngress({
    name: config.ec2.SecurityGroupRuleIngress.sgRuleIngressSsh.name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.securityGroup,
    }),
    properties: () =>
      config.ec2.SecurityGroupRuleIngress.sgRuleIngressSsh.properties,
  });

  provider.ec2.makeSecurityGroupRuleIngress({
    name: config.ec2.SecurityGroupRuleIngress.sgRuleIngressIcmp.name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.securityGroup,
    }),
    properties: () =>
      config.ec2.SecurityGroupRuleIngress.sgRuleIngressIcmp.properties,
  });

  provider.ec2.useDefaultSecurityGroupRuleIngress({
    name: config.ec2.SecurityGroupRuleIngress
      .sgDefaultVpcEc2ExampleRuleIngressAll.name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.sgDefaultVpcEc2Example,
      securityGroupFrom: resources.ec2.SecurityGroup.sgDefaultVpcEc2Example,
    }),
  });

  provider.ec2.useDefaultSecurityGroupRuleIngress({
    name: config.ec2.SecurityGroupRuleIngress.sgDefaultVpcDefaultRuleIngressAll
      .name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.sgDefaultVpcDefault,
    }),
  });

  provider.ec2.useDefaultSecurityGroupRuleEgress({
    name: config.ec2.SecurityGroupRuleEgress.securityGroupRuleEgressAll.name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.securityGroup,
    }),
  });

  provider.ec2.useDefaultSecurityGroupRuleEgress({
    name: config.ec2.SecurityGroupRuleEgress.sgDefaultVpcEc2ExampleRuleEgressAll
      .name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.sgDefaultVpcEc2Example,
    }),
  });

  provider.ec2.useDefaultSecurityGroupRuleEgress({
    name: config.ec2.SecurityGroupRuleEgress.sgDefaultVpcDefaultRuleEgressAll
      .name,
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.sgDefaultVpcDefault,
    }),
  });

  provider.ec2.makeInstance({
    name: config.ec2.Instance.webServerEc2Vpc.name,
    dependencies: ({ resources }) => ({
      subnet: resources.ec2.Subnet.subnet,
      keyPair: resources.ec2.KeyPair.kp,
      eip: resources.ec2.ElasticIpAddress.myip,
      securityGroups: [resources.ec2.SecurityGroup.securityGroup],
      volumes: [resources.ec2.Volume.volume],
    }),
    properties: () => config.ec2.Instance.webServerEc2Vpc.properties,
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({
    provider,
  });

  return {
    provider,
    resources,
  };
};
