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
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "EC2";

const filterTargetDefault = pipe([omit(["TagSpecifications"])]);
const filterLiveDefault = pipe([omit(["Tags"])]);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "KeyPair",
      Client: AwsClientKeyPair,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          defaultsDeep({ KeyType: "rsa" }),
          filterTargetDefault,
        ]),
        filterLive: pipe([
          filterLiveDefault,
          omit(["KeyPairId", "KeyFingerprint"]),
        ]),
      }),
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
        filterLive: pipe([
          omit([
            "Attachments",
            "CreateTime",
            "Encrypted",
            "SnapshotId",
            "State",
            "VolumeId",
            "MultiAttachEnabled",
          ]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "Vpc",
      dependsOn: ["IAM::User", "IAM::Group"],
      Client: AwsVpc,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          defaultsDeep({ DnsSupport: true, DnsHostnames: false }),
          filterTargetDefault,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          filterLiveDefault,
          omit([
            "DhcpOptionsId",
            "State",
            "OwnerId",
            "InstanceTenancy",
            "Ipv6CidrBlockAssociationSet",
            "CidrBlockAssociationSet",
            "IsDefault",
            "VpcId",
          ]),
        ]),
      }),
    },
    {
      type: "InternetGateway",
      dependsOn: ["EC2::Vpc"],
      Client: AwsInternetGateway,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([filterTargetDefault]),
        filterLive: pipe([
          omit(["Attachments", "InternetGatewayId", "OwnerId"]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "NatGateway",
      dependsOn: ["EC2::ElasticIpAddress", "EC2::Subnet"],
      Client: AwsNatGateway,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["AllocationId"]), filterTargetDefault]),
        filterLive: pipe([
          omit([
            "CreateTime",
            "NatGatewayAddresses",
            "NatGatewayId",
            "State",
            "VpcId",
            "ConnectivityType",
          ]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "Subnet",
      dependsOn: ["EC2::Vpc", "EC2::InternetGateway"],
      Client: AwsSubnet,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["VpcId"])]),
        filterTarget: pipe([
          defaultsDeep({
            MapPublicIpOnLaunch: false,
            MapCustomerOwnedIpOnLaunch: false,
          }),
          filterTargetDefault,
        ]),
        filterLive: pipe([
          omit([
            "AvailabilityZoneId",
            "AvailableIpAddressCount",
            "DefaultForAz",
            "State",
            "SubnetId",
            "OwnerId",
            "AssignIpv6AddressOnCreation",
            "Ipv6CidrBlockAssociationSet",
            "SubnetArn",
          ]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "RouteTable",
      dependsOn: ["EC2::Vpc", "EC2::Subnet"],
      Client: AwsRouteTable,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["VpcId"])]),
        filterTarget: pipe([filterTargetDefault]),
        filterLive: pipe([
          omit([
            "Associations",
            "PropagatingVgws",
            "RouteTableId",
            "OwnerId",
            "Routes",
          ]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "Route",
      dependsOn: ["EC2::RouteTable", "EC2::InternetGateway", "EC2::NatGateway"],
      Client: EC2Route,
      isOurMinion,
      compare: compare({
        filterTarget: filterTargetDefault,
        filterLive: pipe([
          omit([
            "GatewayId",
            "NatGatewayId",
            "Origin",
            "State",
            "name",
            "RouteTableId",
          ]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "SecurityGroup",
      dependsOn: ["EC2::Vpc", "EC2::Subnet"],
      Client: AwsSecurityGroup,
      isOurMinion,
      compare: compare({
        filterTarget: filterTargetDefault,
        filterLive: pipe([pick(["Description", "GroupName", "VpcId"])]),
      }),
    },
    {
      type: "SecurityGroupRuleIngress",
      dependsOn: ["EC2::SecurityGroup"],
      Client: AwsSecurityGroupRuleIngress,
      compare: compareSecurityGroupRule,
      isOurMinion,
    },
    {
      type: "SecurityGroupRuleEgress",
      dependsOn: ["EC2::SecurityGroup"],
      Client: AwsSecurityGroupRuleEgress,
      compare: compareSecurityGroupRule,
      isOurMinion,
    },
    {
      type: "ElasticIpAddress",
      dependsOn: ["EC2::InternetGateway", "EC2::NetworkInterface"],
      Client: AwsElasticIpAddress,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit([""]), filterTargetDefault]),
        filterLive: pipe([
          omit([
            "InstanceId",
            "PublicIp",
            "AllocationId",
            "AssociationId",
            "NetworkInterfaceId",
            "NetworkInterfaceOwnerId",
            "PrivateIpAddress",
            "PublicIpv4Pool",
            "NetworkBorderGroup",
          ]),
          filterLiveDefault,
        ]),
      }),
    },
    {
      type: "Instance",
      dependsOn: [
        "EC2::KeyPair",
        "EC2::SecurityGroup",
        "EC2::Subnet",
        "EC2::ElasticIpAddress",
        "EC2::Volume",
        "EC2::NetworkInterface",
        "EC2::InternetGateway",
        "IAM::InstanceProfile",
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
        "EC2::KeyPair",
        "EC2::SecurityGroup",
        "IAM::Role",
        "IAM::InstanceProfile",
      ],
      Client: EC2LaunchTemplate,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["LaunchTemplateData"]), filterTargetDefault]),
        filterLive: pipe([
          omit([
            "LaunchTemplateId",
            "VersionNumber",
            "CreateTime",
            "CreatedBy",
            "DefaultVersion",
            "DefaultVersionNumber",
            "LatestVersionNumber",
            "LaunchTemplateData", //TODO
          ]),
          filterLiveDefault,
        ]),
      }),
    },

    {
      type: "NetworkInterface",
      dependsOn: ["EC2::Subnet", "EC2::SecurityGroup"],
      Client: AwsNetworkInterface,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([filterTargetDefault]),
        filterLive: pipe([filterLiveDefault]),
      }),
    },
    {
      type: "NetworkAcl",
      Client: AwsNetworkAcl,
      listOnly: true,
      isOurMinion,
    },
  ]);
