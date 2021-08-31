// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.EC2.makeVpc({
    name: get("config.EC2.Vpc.vpcTestSg.name"),
    properties: get("config.EC2.Vpc.vpcTestSg.properties"),
  });

  provider.EC2.makeSecurityGroup({
    name: get("config.EC2.SecurityGroup.securityGroupClusterTest.name"),
    properties: get(
      "config.EC2.SecurityGroup.securityGroupClusterTest.properties"
    ),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcTestSg,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: get("config.EC2.SecurityGroup.securityGroupNodeGroupTest.name"),
    properties: get(
      "config.EC2.SecurityGroup.securityGroupNodeGroupTest.properties"
    ),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcTestSg,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: get(
      "config.EC2.SecurityGroupRuleIngress.sgRuleClusterIngressPort_22.name"
    ),
    properties: get(
      "config.EC2.SecurityGroupRuleIngress.sgRuleClusterIngressPort_22.properties"
    ),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupClusterTest,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: get(
      "config.EC2.SecurityGroupRuleIngress.sgRuleNodeGroupIngressCluster.name"
    ),
    properties: get(
      "config.EC2.SecurityGroupRuleIngress.sgRuleNodeGroupIngressCluster.properties"
    ),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupNodeGroupTest,
      securityGroupFrom: resources.EC2.SecurityGroup.securityGroupClusterTest,
    }),
  });

  provider.EC2.makeSecurityGroupRuleEgress({
    name: get("config.EC2.SecurityGroupRuleEgress.sgRuleClusterEgress.name"),
    properties: get(
      "config.EC2.SecurityGroupRuleEgress.sgRuleClusterEgress.properties"
    ),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupClusterTest,
    }),
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};
