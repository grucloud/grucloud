const { isOurMinionEc2 } = require("./AwsEC2Tags");
const { isOurMinion } = require("../AwsCommon");

const { compare } = require("../../../Utils");
const logger = require("../../../logger")({ prefix: "AWSEC2" });
const { tos } = require("../../../tos");

const AwsEC2 = require("./AwsEC2");
const AwsClientKeyPair = require("./AwsKeyPair");
const AwsVpc = require("./AwsVpc");
const AwsInternetGateway = require("./AwsInternetGateway");
const AwsRouteTables = require("./AwsRouteTables");
const AwsSubnet = require("./AwsSubnet");
const AwsSecurityGroup = require("./AwsSecurityGroup");
const AwsElasticIpAddress = require("./AwsElasticIpAddress");

module.exports = [
  {
    type: "KeyPair",
    Client: ({ spec, config }) => AwsClientKeyPair({ spec, config }),
    listOnly: true,
    isOurMinion,
  },
  {
    type: "Vpc",
    Client: ({ spec, config }) => AwsVpc({ spec, config }),
    isOurMinion,
  },
  {
    type: "InternetGateway",
    dependsOn: ["Vpc"],
    Client: ({ spec, config }) => AwsInternetGateway({ spec, config }),
    isOurMinion,
  },
  {
    type: "Subnet",
    dependsOn: ["Vpc"],
    Client: ({ spec, config }) => AwsSubnet({ spec, config }),
    isOurMinion,
  },
  {
    type: "RouteTables",
    dependsOn: ["Vpc", "Subnet", "InternetGateway"],
    Client: ({ spec, config }) => AwsRouteTables({ spec, config }),
    isOurMinion,
  },
  {
    type: "SecurityGroup",
    dependsOn: ["Vpc", "InternetGateway"],
    Client: ({ spec, config }) => AwsSecurityGroup({ spec, config }),
    isOurMinion,
  },
  {
    type: "ElasticIpAddress",
    dependsOn: ["InternetGateway", "RouteTables"],
    Client: ({ spec, config }) => AwsElasticIpAddress({ spec, config }),
    isOurMinion,
  },
  {
    type: "EC2",
    dependsOn: [
      "SecurityGroup",
      "Subnet",
      "ElasticIpAddress",
      "InternetGateway",
      "IamInstanceProfile",
    ],
    Client: ({ spec, config }) =>
      AwsEC2({
        spec,
        config,
      }),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html#runInstances-property
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
    isOurMinion: isOurMinionEc2,
  },
];
