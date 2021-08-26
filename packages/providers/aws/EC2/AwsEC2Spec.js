const assert = require("assert");
const { pipe, get, assign, map, omit, tap, pick } = require("rubico");
const { compare } = require("@grucloud/core/Common");
const { isOurMinion } = require("../AwsCommon");

const {
  EC2Instance,
  isOurMinionEC2Instance,
  compareEC2Instance,
} = require("./EC2Instance");
const { EC2LaunchTemplate } = require("./EC2LaunchTemplate");

const { AwsClientKeyPair } = require("./AwsKeyPair");
const { AwsVpc } = require("./AwsVpc");
const { AwsInternetGateway } = require("./AwsInternetGateway");
const { AwsNatGateway } = require("./AwsNatGateway");
const { AwsRouteTable } = require("./AwsRouteTable");
const { EC2Route } = require("./EC2Route");
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

const filterTargetDefault = pipe([omit(["TagSpecifications"])]);
const filterLiveDefault = pipe([omit(["Tags"])]);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "KeyPair",
      Client: AwsClientKeyPair,
      isOurMinion,
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
      compare: compare({
        filterTarget: pipe([omit(["Device"]), filterTargetDefault]),
        filterLive: filterLiveDefault,
      }),
    },
    {
      type: "Vpc",
      dependsOn: ["iam::User", "iam::Group"],
      Client: AwsVpc,
      isOurMinion,
    },
    {
      type: "InternetGateway",
      dependsOn: ["ec2::Vpc"],
      Client: AwsInternetGateway,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["AllocationId"]), filterTargetDefault]),
        filterLive: filterLiveDefault,
      }),
    },
    {
      type: "NatGateway",
      dependsOn: ["ec2::ElasticIpAddress", "ec2::Subnet"],
      Client: AwsNatGateway,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["AllocationId"]), filterTargetDefault]),
        filterLive: filterLiveDefault,
      }),
    },
    {
      type: "Subnet",
      dependsOn: ["ec2::Vpc", "ec2::InternetGateway"],
      Client: AwsSubnet,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["VpcId"]), filterTargetDefault]),
        filterLive: pipe([omit(["VpcId"]), filterLiveDefault]),
      }),
    },
    {
      type: "RouteTable",
      dependsOn: ["ec2::Vpc", "ec2::Subnet"],
      Client: AwsRouteTable,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["VpcId"]), filterTargetDefault]),
        filterLive: pipe([omit(["VpcId"]), filterLiveDefault]),
      }),
    },
    {
      type: "Route",
      dependsOn: ["ec2::RouteTable", "ec2::InternetGateway", "ec2::NatGateway"],
      Client: EC2Route,
      isOurMinion,
    },
    {
      type: "SecurityGroup",
      dependsOn: ["ec2::Vpc", "ec2::Subnet"],
      Client: AwsSecurityGroup,
      isOurMinion,
      compare: compare({
        filterTarget: filterTargetDefault,
        filterLive: pipe([pick(["Description", "GroupName", "VpcId"])]),
      }),
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
        "ec2::KeyPair",
        "ec2::SecurityGroup",
        "ec2::Subnet",
        "ec2::ElasticIpAddress",
        "ec2::Volume",
        "ec2::NetworkInterface",
        "ec2::InternetGateway",
        "iam::InstanceProfile",
      ],
      Client: EC2Instance,
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
      type: "LaunchTemplate",
      dependsOn: [
        "ec2::KeyPair",
        "ec2::SecurityGroup",
        "ec2::Volume",
        "iam::Role",
        "iam::InstanceProfile",
      ],
      Client: EC2LaunchTemplate,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([filterTargetDefault]),
        filterLive: filterLiveDefault,
      }),
    },

    {
      type: "NetworkInterface",
      dependsOn: ["ec2::Subnet", "ec2::SecurityGroup"],
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
