const AWS = require("aws-sdk");
const assert = require("assert");
const _ = require("lodash");
const CoreProvider = require("../CoreProvider");
const AwsClientEC2 = require("./AwsClientEC2");
const AwsClientKeyPair = require("./AwsClientKeyPair");
const AwsVpc = require("./AwsVpc");
const AwsSubnet = require("./AwsSubnet");
const AwsSecurityGroup = require("./AwsSecurityGroup");
const logger = require("../../logger")({ prefix: "AwsProvider" });
const compare = require("../../Utils").compare;
const AwsTags = require("./AwsTags");
const toString = (x) => JSON.stringify(x, null, 4);

const fnSpecs = (config) => {
  const isOurMinion = ({ resource }) =>
    AwsTags.isOurMinion({ resource, config });

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
      type: "Subnet",
      dependsOn: ["Vpc"],
      Client: ({ spec }) => AwsSubnet({ spec, config }),
      isOurMinion,
    },
    {
      type: "SecurityGroup",
      dependsOn: ["Vpc"],
      Client: ({ spec }) => AwsSecurityGroup({ spec, config }),
      isOurMinion,
    },
    {
      type: "Instance",
      dependsOn: ["SecurityGroup", "Subnet"],
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
        logger.debug(`compare ${toString(diff)}`);
        return diff;
      },
      isOurMinion: ({ resource }) =>
        AwsTags.isOurMinionEc2({ resource, config }),
    },
  ];
};

module.exports = AwsProvider = async ({ name, config }) => {
  assert(name);
  assert(config);

  AWS.config.update({ region: config.region });
  AWS.config.apiVersions = {
    ec2: "2016-11-15",
    resourcegroupstaggingapi: "2017-01-26",
  };

  return CoreProvider({
    type: "aws",
    name,
    mandatoryConfigKeys: ["AWSAccessKeyId", "AWSSecretKey", "accountId"],
    config,
    fnSpecs,
  });
};
