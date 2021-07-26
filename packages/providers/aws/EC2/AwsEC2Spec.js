const { pipe, assign, map } = require("rubico");

const { isOurMinion } = require("../AwsCommon");

const {
  AwsEC2,
  isOurMinionEC2Instance,
  compareEC2Instance,
} = require("./AwsEC2");
const { AwsClientKeyPair } = require("./AwsKeyPair");
const { AwsVpc } = require("./AwsVpc");
const { AwsInternetGateway } = require("./AwsInternetGateway");
const { AwsNatGateway } = require("./AwsNatGateway");
const { AwsRouteTable } = require("./AwsRouteTable");
const { AwsRoute } = require("./AwsRoute");
const { AwsSubnet } = require("./AwsSubnet");
const { AwsSecurityGroup } = require("./AwsSecurityGroup");
const {
  AwsSecurityGroupRuleIngress,
  AwsSecurityGroupRuleEgress,
  compareSecurityGroupRule,
} = require("./AwsSecurityGroupRule");
const { AwsElasticIpAddress } = require("./AwsElasticIpAddress");
const { AwsVolume, setupEbsVolume } = require("./AwsVolume");
const { AwsNetworkInterface } = require("./AwsNetworkInterface");
const { AwsNetworkAcl } = require("./AwsNetworkAcl");
const { AwsImage } = require("./AwsImage");

const GROUP = "ec2";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "KeyPair",
      Client: AwsClientKeyPair,
      isOurMinion, // TODO do we need isOurMinion for listOnly ?
    },
    {
      type: "Image",
      Client: AwsImage,
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
      dependsOn: ["iam::User", "iam::Group"],
      Client: AwsVpc,
      isOurMinion,
    },
    {
      type: "InternetGateway",
      dependsOn: ["ec2::Vpc", "ec2::NetworkInterface"],
      Client: AwsInternetGateway,
      isOurMinion,
    },
    {
      type: "NatGateway",
      dependsOn: [
        "ec2::ElasticIpAddress",
        "ec2::Subnet",
        "ec2::NetworkInterface",
      ],
      Client: AwsNatGateway,
      isOurMinion,
    },
    {
      type: "Subnet",
      dependsOn: ["ec2::Vpc", "ec2::InternetGateway", "ec2::NetworkInterface"],
      Client: AwsSubnet,
      isOurMinion,
    },
    {
      type: "RouteTable",
      dependsOn: ["ec2::Vpc", "ec2::Subnet"],
      Client: AwsRouteTable,
      isOurMinion,
    },
    {
      type: "Route",
      dependsOn: ["ec2::RouteTable", "ec2::InternetGateway", "ec2::NatGateway"],
      Client: AwsRoute,
      isOurMinion,
    },
    {
      type: "SecurityGroup",
      dependsOn: ["ec2::Vpc", "ec2::NetworkInterface", "ec2::Subnet"],
      Client: AwsSecurityGroup,
      isOurMinion,
    },
    {
      type: "SecurityGroupRuleIngress",
      dependsOn: ["ec2::SecurityGroup"],
      Client: AwsSecurityGroupRuleIngress,
      compare: compareSecurityGroupRule,
      isOurMinion,
    },
    {
      type: "SecurityGroupRuleEgress",
      dependsOn: ["ec2::SecurityGroup"],
      Client: AwsSecurityGroupRuleEgress,
      compare: compareSecurityGroupRule,
      isOurMinion,
    },
    {
      type: "ElasticIpAddress",
      dependsOn: ["ec2::InternetGateway", "ec2::NetworkInterface"],
      Client: AwsElasticIpAddress,
      isOurMinion,
    },
    {
      type: "Instance",
      dependsOn: [
        "ec2::SecurityGroup",
        "ec2::Subnet",
        "ec2::ElasticIpAddress",
        "iam::InstanceProfile",
        "ec2::Volume",
        "ec2::NetworkInterface",
        "ec2::InternetGateway",
        "ec2::NetworkInterface",
      ],
      Client: AwsEC2,
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html#runInstances-property
      propertiesDefault: {
        InstanceType: "t2.micro",
        MaxCount: 1,
        MinCount: 1,
      },
      compare: compareEC2Instance,
      isOurMinion: isOurMinionEC2Instance,
    },
    {
      type: "NetworkInterface",
      Client: AwsNetworkInterface,
      isOurMinion,
    },
    {
      type: "NetworkAcl",
      Client: AwsNetworkAcl,
      listOnly: true,
      isOurMinion,
    },
  ]);
