const { AwsProvider } = require("@grucloud/provider-aws");
const { map } = require("rubico");

const createResources = async ({ provider }) => {
  const { config } = provider;

  const vpc = await provider.makeVpc({
    name: config.rds.vpc.name,
    properties: () => ({
      DnsHostnames: true,
      CidrBlock: "192.168.0.0/16",
    }),
  });

  const ig = await provider.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property
  const dbInstance = await provider.makeDBInstance({
    name: config.rds.instance.name,
    dependencies: { dbSubnetGroup },
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
  };
};
