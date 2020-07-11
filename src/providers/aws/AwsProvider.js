const AWS = require("aws-sdk");
const assert = require("assert");
const _ = require("lodash");
const { map } = require("rubico");

const logger = require("../../logger")({ prefix: "AwsProvider" });
const { checkConfig, compare } = require("../../Utils");
const { tos } = require("../../tos");
const CoreProvider = require("../CoreProvider");

const AwsTags = require("./AwsTags");

const AwsClientEC2 = require("./AwsEC2");
const AwsClientKeyPair = require("./AwsKeyPair");
const AwsVpc = require("./AwsVpc");
const AwsInternetGateway = require("./AwsInternetGateway");
const AwsRouteTables = require("./AwsRouteTables");
const AwsSubnet = require("./AwsSubnet");
const AwsSecurityGroup = require("./AwsSecurityGroup");
const AwsElasticIpAddress = require("./AwsElasticIpAddress");

const fnSpecs = (config) => {
  const isOurMinion = ({ resource }) =>
    AwsTags.isOurMinion({ resource, config });

  return [
    {
      type: "KeyPair",
      Client: ({ spec }) => AwsClientKeyPair({ spec, config }),
      listOnly: true,
      isOurMinion,
    },
    {
      type: "Vpc",
      Client: ({ spec }) => AwsVpc({ spec, config }),
      isOurMinion,
    },
    {
      type: "InternetGateway",
      dependsOn: ["Vpc"],
      Client: ({ spec }) => AwsInternetGateway({ spec, config }),
      isOurMinion,
    },
    {
      type: "Subnet",
      dependsOn: ["Vpc"],
      Client: ({ spec }) => AwsSubnet({ spec, config }),
      isOurMinion,
    },
    {
      type: "RouteTables",
      dependsOn: ["Vpc", "Subnet", "InternetGateway"],
      Client: ({ spec }) => AwsRouteTables({ spec, config }),
      isOurMinion,
    },
    {
      type: "SecurityGroup",
      dependsOn: ["Vpc", "InternetGateway"],
      Client: ({ spec }) => AwsSecurityGroup({ spec, config }),
      isOurMinion,
    },
    {
      type: "ElasticIpAddress",
      dependsOn: ["InternetGateway", "RouteTables"],
      Client: ({ spec }) => AwsElasticIpAddress({ spec, config }),
      isOurMinion,
    },
    {
      type: "EC2",
      dependsOn: ["SecurityGroup", "Subnet", "ElasticIpAddress"],
      Client: ({ spec }) =>
        AwsClientEC2({
          spec,
          config,
        }),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property
      propertiesDefault: {
        VolumeSize: 100,
        InstanceType: "t2.micro",
        MaxCount: 1,
        MinCount: 1,
        ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
      },

      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: ["InstanceType"], //TODO
          live: live.Instances[0],
        });
        logger.debug(`compare ${tos(diff)}`);
        return diff;
      },
      isOurMinion: ({ resource }) =>
        AwsTags.isOurMinionEc2({ resource, config }),
    },
  ];
};

const validateConfig = async ({ region, zone }) => {
  logger.debug(`region: ${region}, zone: ${zone}`);
  const ec2 = new AWS.EC2();
  const { AvailabilityZones } = await ec2.describeAvailabilityZones().promise();
  const zones = map((x) => x.ZoneName)(AvailabilityZones);
  if (!zones.includes(zone)) {
    const message = `The configued zone '${zone}' is not part of region ${region}, available zones for this region: ${zones}`;
    throw { code: 400, type: "configuration", message };
  }
};

module.exports = AwsProvider = async ({ name, config }) => {
  assert(name);
  assert(config);

  const mandatoryConfigKeys = ["region", "zone"];
  checkConfig(config, mandatoryConfigKeys);

  AWS.config.apiVersions = {
    ec2: "2016-11-15",
    resourcegroupstaggingapi: "2017-01-26",
  };
  AWS.config.update({ region: config.region });
  await validateConfig(config);

  return CoreProvider({
    type: "aws",
    name,
    mandatoryEnvs: ["AWSAccessKeyId", "AWSSecretKey", "AccountId"],
    config,
    fnSpecs,
  });
};
