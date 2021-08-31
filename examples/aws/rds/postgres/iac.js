const { AwsProvider } = require("@grucloud/provider-aws");
const { map } = require("rubico");

const createResources = async ({ provider }) => {
  const { config } = provider;

  const vpc = provider.EC2.makeVpc({
    name: config.RDS.vpc.name,
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: "192.168.0.0/16",
    }),
  });

  const internetGateway = provider.EC2.makeInternetGateway({
    name: config.RDS.internetGateway.name,
    dependencies: { vpc },
  });

  const securityGroup = provider.EC2.makeSecurityGroup({
    name: "security-group",
    dependencies: { vpc },
    properties: () => ({
      Description: "Security Group Postgres",
    }),
  });

  const sgRuleIngressPostgres = provider.EC2.makeSecurityGroupRuleIngress({
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
    provider.EC2.makeSubnet({
      name: subnet.name,
      dependencies: { vpc },
      properties: () => subnet.properties,
    })
  )(config.RDS.subnets);

  const routeTablePublic = provider.EC2.makeRouteTable({
    name: "route-table-public",
    dependencies: { vpc, subnets },
  });

  provider.EC2.makeRoute({
    name: "route-public",
    dependencies: { routeTable: routeTablePublic, ig: internetGateway },
  });

  const dbSubnetGroup = provider.RDS.makeDBSubnetGroup({
    name: config.RDS.subnetGroup.name,
    dependencies: { subnets },
    properties: () => ({ DBSubnetGroupDescription: "db subnet group" }),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property
  const dbInstance = provider.RDS.makeDBInstance({
    name: config.RDS.instance.name,
    dependencies: { dbSubnetGroup, securityGroups: [securityGroup] },
    properties: () => config.RDS.instance.properties,
  });

  return {
    dbInstance,
  };
};

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
    hooks: [require("./hook")],
  };
};
