const { AwsProvider } = require("@grucloud/provider-aws");
const { map } = require("rubico");

const createResources = async ({ provider }) => {
  const { config } = provider;

  const vpc = provider.ec2.makeVpc({
    name: config.rds.vpc.name,
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: "192.168.0.0/16",
    }),
  });

  const internetGateway = provider.ec2.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
  });

  const securityGroup = provider.ec2.makeSecurityGroup({
    name: "security-group",
    dependencies: { vpc },
    properties: () => ({
      create: {
        Description: "Security Group Postgres",
      },
    }),
  });

  const sgRuleIngressPostgres = provider.ec2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-postgres",
    dependencies: {
      securityGroup,
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

  const subnets = await map((subnet) =>
    provider.makeSubnet({
      name: subnet.name,
      dependencies: { vpc },
      properties: () => subnet.properties,
    })
  )(config.rds.subnets);

  const routeTablePublic = provider.ec2.makeRouteTable({
    name: "route-table-public",
    dependencies: { vpc, subnets },
  });

  provider.ec2.makeRoute({
    name: "route-public",
    dependencies: { routeTable: routeTablePublic, ig: internetGateway },
  });

  const dbSubnetGroup = provider.rds.makeDBSubnetGroup({
    name: config.rds.subnetGroup.name,
    dependencies: { subnets },
    properties: () => ({ DBSubnetGroupDescription: "db subnet group" }),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property
  const dbInstance = provider.rds.makeDBInstance({
    name: config.rds.instance.name,
    dependencies: { dbSubnetGroup, dbSecurityGroups: [securityGroup] },
    properties: () => config.rds.instance.properties,
  });

  return {
    dbInstance,
  };
};

exports.createStack = async ({ config, stage }) => {
  const provider = AwsProvider({ config, stage });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
    hooks: [require("./hook")],
  };
};
