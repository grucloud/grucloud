const assert = require("assert");
const { map } = require("rubico");
const { pluck } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");

const configs = [require("./config"), ModuleAwsVpc.config];
exports.configs = configs;

const createResourcesRds = async ({
  provider,
  resources: { vpcResources, bastionResources },
}) => {
  const { config } = provider;

  const securityGroup = provider.ec2.makeSecurityGroup({
    name: "security-group-postgres",
    dependencies: { vpc: vpcResources.vpc },
    properties: () => ({
      Description: "Security Group Postgres",
    }),
  });

  const sgRuleIngressPostgres = provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-postgres",
    dependencies: {
      securityGroup,
      securityGroupFrom: bastionResources.securityGroup,
    },
    properties: () => ({
      IpPermission: {
        FromPort: 5432,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
        ToPort: 5432,
      },
    }),
  });

  const subnets = pluck("subnet")(vpcResources.privates);

  const dbSubnetGroup = provider.rds.makeDBSubnetGroup({
    name: config.rds.subnetGroup.name,
    dependencies: { subnets },
    properties: () => ({ DBSubnetGroupDescription: "db subnet group" }),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
  const dbCluster = provider.rds.makeDBCluster({
    name: config.rds.cluster.name,
    dependencies: { dbSubnetGroup, securityGroups: [securityGroup] },
    properties: () => config.rds.cluster.properties,
  });

  return {
    dbCluster,
  };
};

const createResourcesBastion = async ({
  provider,
  resources: { vpcResources, keyPair },
}) => {
  const { config } = provider;

  const securityGroup = provider.ec2.makeSecurityGroup({
    name: "security-group-public",
    dependencies: { vpc: vpcResources.vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      Description: "Security Group Description",
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    }),
  });

  const sgRuleIngressSsh = provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-ssh-bastion",
    dependencies: {
      securityGroup,
    },
    properties: () => ({
      IpPermission: {
        FromPort: 22,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
        ToPort: 22,
      },
    }),
  });

  assert(config.rds.eip);
  const eip = provider.ec2.makeElasticIpAddress({
    name: config.rds.eip.name,
  });

  const image = provider.ec2.useImage({
    name: "Amazon Linux 2",
    properties: () => ({
      Filters: [
        {
          Name: "architecture",
          Values: ["x86_64"],
        },
        {
          Name: "description",
          Values: ["Amazon Linux 2 AMI *"],
        },
      ],
    }),
  });

  return {
    eip,
    securityGroup,
    ec2Instance: provider.ec2.makeInstance({
      name: config.rds.ec2Instance.name,
      dependencies: {
        keyPair,
        eip,
        image,
        securityGroups: [securityGroup],
        subnet: vpcResources.subnetsPublic[0],
      },
      properties: config.rds.ec2Instance.properties,
    }),
  };
};

const createResources = async ({
  provider,
  resources: { keyPair, vpcResources },
}) => {
  const bastionResources = await createResourcesBastion({
    provider,
    resources: { keyPair, vpcResources },
  });

  const resourcesRds = await createResourcesRds({
    provider,
    resources: { vpcResources, bastionResources },
  });
  return { rds: resourcesRds, bastion: bastionResources };
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs,
  });

  const keyPair = provider.ec2.makeKeyPair({
    name: provider.config.keyPair.name,
  });

  const vpcResources = await ModuleAwsVpc.createResources({
    provider,
  });

  return {
    provider,
    resources: await createResources({
      provider,
      resources: { vpcResources, keyPair },
    }),
    hooks: [require("./hook")],
  };
};
