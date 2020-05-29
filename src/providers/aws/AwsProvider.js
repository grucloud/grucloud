const AWS = require("aws-sdk");
const assert = require("assert");
const CoreProvider = require("../CoreProvider");
const AwsClientEc2 = require("./AwsClientEc2");
const AwsClientKeyPair = require("./AwsClientKeyPair");
const AwsVpc = require("./AwsVpc");

const AwsSecurityGroup = require("./AwsSecurityGroup");
const logger = require("../../logger")({ prefix: "AwsProvider" });
const compare = require("../../Utils").compare;
const AwsTags = require("./AwsTags");
const toString = (x) => JSON.stringify(x, null, 4);

const fnSpecs = (config) => {
  const { tag } = config;

  const isOurMinion = ({ resource }) => AwsTags.isOurMinion({ resource, tag });

  return [
    {
      type: "KeyPair",
      Client: ({ spec }) => AwsClientKeyPair({ spec, config }),
      methods: { list: true },
      isOurMinion,
    },
    {
      type: "Vpc",
      Client: ({ spec }) => AwsVpc({ spec, config }),
      isOurMinion,
    },
    {
      type: "SecurityGroup",
      Client: ({ spec }) => AwsSecurityGroup({ spec, config }),
      isOurMinion,
      compare: ({ target, live }) => {
        logger.debug(`compare SecurityGroup`);
        const diff = compare({
          target,
          targetKeys: ["IpPermissions"], //TODO
          live: live,
        });
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
    },
    {
      type: "Instance",
      Client: ({ spec }) =>
        AwsClientEc2({
          spec,
          config,
        }),
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
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
      isOurMinion: ({ resource }) => AwsTags.isOurMinionEc2({ resource, tag }),
    },
  ];
};

const configCheck = (config) => {
  assert(config, "Please provide a config");
  const { region } = config;
  assert(region, "region is missing");
};

module.exports = AwsProvider = async ({ name, config }) => {
  assert(name);
  configCheck(config);

  AWS.config.update({ region: config.region });

  return CoreProvider({
    type: "aws",
    name,
    envs: ["AWSAccessKeyId", "AWSSecretKey"],
    config,
    fnSpecs,
  });
};
