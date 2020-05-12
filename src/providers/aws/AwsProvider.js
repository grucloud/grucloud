const assert = require("assert");
const CoreProvider = require("../CoreProvider");
const AwsClient = require("./AwsClient");
const logger = require("../../logger")({ prefix: "AwsProvider" });
const compare = require("../../Utils").compare;

const AwsClientEc2 = require("./AwsClientEC2");

const fnSpecs = ({ tag }) => [
  {
    type: "Instance",
    Client: AwsClientEc2,
    propertiesDefault: {
      VolumeSize: 100,
      InstanceType: "t2.micro",
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    },
    configDefault: ({ name, properties }) => ({
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
      //KeyName: "gc",
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
              Value: true,
            },
          ],
        },
      ],
    }),
    compare: ({ target, live }) => {
      logger.debug(`compare server`);
      const diff = compare({
        target,
        targetKeys: [], //TODO
        live,
      });
      logger.debug(`compare ${toString(diff)}`);
      return diff;
    },
  },
];

const configCheck = (config) => {
  assert(config, "Please provide a config");
  const { region } = config;
  assert(region, "region is missing");
};

module.exports = AwsProvider = async ({ name, config }) => {
  configCheck(config);
  return CoreProvider({
    type: "aws",
    name,
    config,
    fnSpecs,
    //Client: AwsClient,
  });
};
