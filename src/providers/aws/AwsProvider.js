const AWS = require("aws-sdk");
const assert = require("assert");
const CoreProvider = require("../CoreProvider");
const AwsClientEc2 = require("./AwsClientEc2");
const AwsClientKeyPair = require("./AwsClientKeyPair");

const logger = require("../../logger")({ prefix: "AwsProvider" });
const compare = require("../../Utils").compare;
const { isOurMinion } = require("./AwsTags");
const toString = (x) => JSON.stringify(x, null, 4);

const toId = (item) => {
  assert(item);
  const id = item.Instances[0].InstanceId;
  assert(id);
  return id;
};

const findName = (item) => {
  assert(item);
  const tag = item.Instances[0].Tags.find((tag) => tag.Key === "name");
  if (tag?.Value) {
    return tag.Value;
  } else {
    throw Error(`cannot find name in ${toString(item)}`);
  }
};

const fnSpecs = ({ tag }) => [
  {
    type: "KeyPair",
    Client: AwsClientKeyPair,
    methods: { list: true },
  },
  {
    type: "Instance",
    Client: AwsClientEc2,
    findName,
    toId,
    propertiesDefault: {
      VolumeSize: 100,
      InstanceType: "t2.micro",
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    },
    configDefault: ({ name, properties, dependencies }) => {
      const { keyPair } = dependencies;
      return {
        ...{
          BlockDeviceMappings: [
            {
              DeviceName: "/dev/sdh",
              Ebs: {
                VolumeSize: properties.VolumeSize,
              },
            },
          ],
          ImageId: properties.ImageId, // Ubuntu 20.04
          InstanceType: properties.InstanceType,
          MaxCount: properties.MaxCount,
          MinCount: properties.MinCount,
          //SecurityGroupIds: ["sg-1a2b3c4d"],
          //SubnetId: "subnet-6e7f829e",
          TagSpecifications: [
            {
              ResourceType: "instance",
              Tags: [
                {
                  Key: "name",
                  Value: name,
                },
                {
                  Key: tag,
                  Value: "true",
                },
              ],
            },
          ],
        },
        [keyPair && "KeyName"]: keyPair.name,
      };
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
    isOurMinion,
  },
];

const configCheck = (config) => {
  assert(config, "Please provide a config");
  const { region } = config;
  assert(region, "region is missing");
};

module.exports = AwsProvider = async ({ name, config }) => {
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
