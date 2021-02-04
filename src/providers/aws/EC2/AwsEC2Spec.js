const { isOurMinion } = require("../AwsCommon");

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
const { AwsVolume, setupEbsVolume } = require("./AwsVolume");

module.exports = [
  {
    type: "KeyPair",
    Client: ({ spec, config }) => AwsClientKeyPair({ spec, config }),
    listOnly: true,
    isOurMinion,
  },
  {
    type: "Volume",
    Client: ({ spec, config }) => AwsVolume({ spec, config }),
    isOurMinion,
    setupEbsVolume,
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
      "Volume",
    ],
    Client: ({ spec, config }) =>
      AwsEC2({
        spec,
        config,
      }),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html#runInstances-property
    propertiesDefault: {
      InstanceType: "t2.micro",
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    },
    isOurMinion,
  },
];
