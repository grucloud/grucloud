const { AwsProvider } = require("@grucloud/provider-aws");
const { map } = require("rubico");

const createResources = async ({ provider }) => {
  const { config } = provider;

  const vpc = await provider.makeVpc({
    name: config.rds.vpc.name,
    properties: () => ({
      CidrBlock: "192.168.0.0/16",
    }),
  });

  const subnets = await map((subnet) =>
    provider.makeSubnet({
      name: subnet.name,
      dependencies: { vpc },
      properties: () => subnet.properties,
    })
  )(config.rds.subnets);

  const dbSubnetGroup = await provider.makeDBSubnetGroup({
    name: config.rds.subnetGroup.name,
    dependencies: { subnets },
    properties: () => ({ DBSubnetGroupDescription: "db subnet group" }),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
  const dbCluster = await provider.makeDBCluster({
    name: config.rds.cluster.name,
    dependencies: { dbSubnetGroup },
    properties: () => config.rds.cluster.properties,
  });

  return {
    dbCluster,
  };
};

exports.createStack = async ({ config, stage }) => {
  const provider = AwsProvider({ config, stage });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
  };
};
