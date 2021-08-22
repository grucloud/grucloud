// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.ec2.makeVpc({
    name: get("config.ec2.Vpc.vpcTestSg.name"),
    properties: get("config.ec2.Vpc.vpcTestSg.properties"),
  });

  provider.ec2.makeSecurityGroup({
    name: get("config.ec2.SecurityGroup.securityGroupClusterTest.name"),
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcTestSg,
    }),
    properties: get(
      "config.ec2.SecurityGroup.securityGroupClusterTest.properties"
    ),
  });

  provider.ec2.makeSecurityGroup({
    name: get("config.ec2.SecurityGroup.securityGroupNodeGroupTest.name"),
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcTestSg,
    }),
    properties: get(
      "config.ec2.SecurityGroup.securityGroupNodeGroupTest.properties"
    ),
  });

  provider.ec2.makeSecurityGroupRuleIngress({
    name: get(
      "config.ec2.SecurityGroupRuleIngress.sgRuleClusterIngressPort_22.name"
    ),
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.securityGroupClusterTest,
    }),
    properties: get(
      "config.ec2.SecurityGroupRuleIngress.sgRuleClusterIngressPort_22.properties"
    ),
  });

  provider.ec2.makeSecurityGroupRuleIngress({
    name: get(
      "config.ec2.SecurityGroupRuleIngress.sgRuleNodeGroupIngressCluster.name"
    ),
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.securityGroupNodeGroupTest,
      securityGroupFrom: resources.ec2.SecurityGroup.securityGroupClusterTest,
    }),
    properties: get(
      "config.ec2.SecurityGroupRuleIngress.sgRuleNodeGroupIngressCluster.properties"
    ),
  });

  provider.ec2.makeSecurityGroupRuleEgress({
    name: get("config.ec2.SecurityGroupRuleEgress.sgRuleClusterEgress.name"),
    dependencies: ({ resources }) => ({
      securityGroup: resources.ec2.SecurityGroup.securityGroupClusterTest,
    }),
    properties: get(
      "config.ec2.SecurityGroupRuleEgress.sgRuleClusterEgress.properties"
    ),
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