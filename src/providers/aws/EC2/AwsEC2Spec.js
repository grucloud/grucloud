const { isOurMinion } = require("../AwsCommon");

const logger = require("../../../logger")({ prefix: "AWSEC2" });
const { tos } = require("../../../tos");

const AwsEC2 = require("./AwsEC2");
const AwsClientKeyPair = require("./AwsKeyPair");
const AwsVpc = require("./AwsVpc");
const { AwsInternetGateway } = require("./AwsInternetGateway");
const { AwsNatGateway } = require("./AwsNatGateway");
const { AwsRouteTables } = require("./AwsRouteTables");
const { AwsRoute } = require("./AwsRoute");

const AwsSubnet = require("./AwsSubnet");
const AwsSecurityGroup = require("./AwsSecurityGroup");
const AwsElasticIpAddress = require("./AwsElasticIpAddress");
const { AwsVolume, setupEbsVolume } = require("./AwsVolume");

module.exports = [
  {
    type: "KeyPair",
    Client: AwsClientKeyPair,
    listOnly: true,
    isOurMinion,
  },
  {
    type: "Volume",
    Client: AwsVolume,
    isOurMinion,
    setupEbsVolume,
  },
  {
    type: "Vpc",
    Client: AwsVpc,
    isOurMinion,
  },
  {
    type: "InternetGateway",
    dependsOn: ["Vpc"],
    Client: AwsInternetGateway,
    isOurMinion,
  },
  {
    type: "NatGateway",
    dependsOn: ["ElasticIpAddress", "Subnet"],
    Client: AwsNatGateway,
    isOurMinion,
  },
  {
    type: "Subnet",
    dependsOn: ["Vpc"],
    Client: AwsSubnet,
    isOurMinion,
  },
  {
    type: "RouteTables",
    dependsOn: ["Vpc", "Subnet"],
    Client: AwsRouteTables,
    isOurMinion,
  },
  {
    type: "Route",
    dependsOn: ["RouteTables", "InternetGateway", "NatGateway"],
    Client: AwsRoute,
    isOurMinion,
  },
  {
    type: "SecurityGroup",
    dependsOn: ["Vpc", "InternetGateway"],
    Client: AwsSecurityGroup,
    isOurMinion,
  },
  {
    type: "ElasticIpAddress",
    dependsOn: ["InternetGateway"],
    Client: AwsElasticIpAddress,
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
    Client: AwsEC2,
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
