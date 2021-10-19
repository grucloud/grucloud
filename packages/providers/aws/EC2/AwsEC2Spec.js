const assert = require("assert");
const {
  pipe,
  get,
  assign,
  map,
  omit,
  tap,
  pick,
  eq,
  not,
  and,
  or,
  any,
  switchCase,
} = require("rubico");
const { when, pluck, identity, includes, isEmpty } = require("rubico/x");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinion } = require("../AwsCommon");

const {
  hasDependency,
  findLiveById,
} = require("@grucloud/core/generatorUtils");
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

const securityGroupRulePickProperties = pipe([
  tap((params) => {
    assert(true);
  }),
  ({ resource }) =>
    (live) =>
      pipe([
        () => live,
        switchCase([
          () =>
            hasDependency({ type: "SecurityGroup", group: "EC2" })(resource),
          omit(["IpPermission.UserIdGroupPairs"]),
          identity,
        ]),
        tap((params) => {
          assert(true);
        }),
        pick(["IpPermission"]),
      ])(),
]);

const ec2InstanceDependencies = () => ({
  subnet: {
    type: "Subnet",
    group: "EC2",
  },
  keyPair: { type: "KeyPair", group: "EC2" },
  eip: { type: "ElasticIpAddress", group: "EC2" },
  iamInstanceProfile: { type: "InstanceProfile", group: "IAM" },
  securityGroups: {
    type: "SecurityGroup",
    group: "EC2",
    list: true,
  },
  volumes: {
    type: "Volume",
    group: "EC2",
    list: true,
    filterDependency:
      ({ resource }) =>
      (dependency) =>
        pipe([
          tap(() => {
            assert(resource);
            assert(resource.live);
            assert(dependency);
            assert(dependency.live);
          }),
          () => dependency,
          get("live.Attachments"),
          pluck("Device"),
          not(includes(resource.live.RootDeviceName)),
        ])(),
  },
});

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
      filterLive: () => pick([""]),
    },
    {
      type: "Image",
      Client: AwsImage,
      isOurMinion,
      ignoreResource: () => () => true,
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
      filterLive: () =>
        pick(["Size", "VolumeType", "Device", "AvailabilityZone"]),
      //TODO do we need that ?
      ignoreResource:
        ({ lives }) =>
        (resource) =>
          pipe([
            () => resource,
            or([
              get("managedByOther"),
              pipe([
                get("live.Attachments"),
                tap((params) => {
                  assert(true);
                }),
                any(({ Device, InstanceId }) =>
                  pipe([
                    () => InstanceId,
                    findLiveById({
                      type: "Instance",
                      group: "EC2",
                      lives,
                      providerName: resource.providerName,
                    }),
                    eq(get("live.RootDeviceName"), Device),
                  ])()
                ),
                tap((params) => {
                  assert(true);
                }),
              ]),
            ]),
          ])(),
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
      filterLive: () => pick(["CidrBlock", "DnsSupport", "DnsHostnames"]),
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
      filterLive: () => pick([]),
      dependencies: () => ({ vpc: { type: "Vpc", group: "EC2" } }),
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
      filterLive: () => pick([]),
      dependencies: () => ({
        subnet: { type: "Subnet", group: "EC2" },
        eip: { type: "ElasticIpAddress", group: "EC2" },
      }),
      //TODO remove ?
      ignoreResource: () => get("isDefault"),
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
      filterLive: () =>
        pick([
          "CidrBlock",
          "Ipv6CidrBlock",
          "AvailabilityZone",
          "MapPublicIpOnLaunch",
          "CustomerOwnedIpv4Pool",
          "MapCustomerOwnedIpOnLaunch",
          "MapPublicIpOnLaunch",
        ]),
      dependencies: () => ({ vpc: { type: "Vpc", group: "EC2" } }),
      //TODO remove ?
      ignoreResource: () => get("isDefault"),
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
      filterLive: () => pick([]),
      ignoreResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          and([get("isDefault"), pipe([get("usedBy"), isEmpty])]),
        ]),
      dependencies: () => ({
        vpc: { type: "Vpc", group: "EC2" },
        subnets: { type: "Subnet", group: "EC2", list: true },
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
      filterLive: () => pick(["DestinationCidrBlock"]),

      includeDefaultDependencies: true,
      dependencies: () => ({
        routeTable: { type: "RouteTable", group: "EC2" },
        ig: { type: "InternetGateway", group: "EC2" },
        natGateway: { type: "NatGateway", group: "EC2" },
      }),
    },
    {
      type: "SecurityGroup",
      dependsOn: ["EC2::Vpc", "EC2::Subnet"],
      Client: AwsSecurityGroup,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([pick(["Description"]), filterTargetDefault]),
        filterLive: pipe([pick(["Description"])]),
      }),
      filterLive: () => pick(["Description"]),
      dependencies: () => ({ vpc: { type: "Vpc", group: "EC2" } }),
    },
    {
      type: "SecurityGroupRuleIngress",
      dependsOn: ["EC2::SecurityGroup"],
      Client: AwsSecurityGroupRuleIngress,
      compare: compareSecurityGroupRule,
      isOurMinion,
      filterLive: securityGroupRulePickProperties,
      includeDefaultDependencies: true,
      dependencies: () => ({
        securityGroup: {
          type: "SecurityGroup",
          group: "EC2",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                eq(get("live.GroupId"), dependency.live.GroupId),
              ])(),
        },
        securityGroupFrom: {
          type: "SecurityGroup",
          group: "EC2",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                tap(() => {
                  assert(dependency.live.GroupId);
                  assert(resource.live.GroupId);
                }),
                get("live.IpPermission.UserIdGroupPairs[0].GroupId", ""),
                and([
                  eq(identity, dependency.live.GroupId),
                  not(eq(resource.live.GroupId, dependency.live.GroupId)),
                ]),
              ])(),
        },
      }),
    },
    {
      type: "SecurityGroupRuleEgress",
      dependsOn: ["EC2::SecurityGroup"],
      Client: AwsSecurityGroupRuleEgress,
      compare: compareSecurityGroupRule,
      isOurMinion,
      filterLive: securityGroupRulePickProperties,
      includeDefaultDependencies: true,
      dependencies: () => ({
        securityGroup: { type: "SecurityGroup", group: "EC2" },
      }),
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
      filterLive: () => pick([]),
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
      filterLive: () =>
        pipe([
          pick(["InstanceType", "ImageId", "UserData"]),
          tap((params) => {
            assert(true);
          }),
          when(
            get("UserData"),
            assign({
              UserData: pipe([
                get("UserData"),
                tap((params) => {
                  assert(true);
                }),
                (UserData) => Buffer.from(UserData, "base64").toString(),
                tap((params) => {
                  assert(true);
                }),
              ]),
            })
          ),
        ]),
      dependencies: ec2InstanceDependencies,
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
      filterLive: () =>
        pipe([
          pick(["LaunchTemplateData"]),
          omitIfEmpty([
            "LaunchTemplateData.BlockDeviceMappings",
            "LaunchTemplateData.ElasticGpuSpecifications",
            "LaunchTemplateData.ElasticInferenceAccelerators",
            "LaunchTemplateData.SecurityGroups",
            "LaunchTemplateData.LicenseSpecifications",
            "LaunchTemplateData.TagSpecifications",
          ]),
          omit([
            "LaunchTemplateData.NetworkInterfaces",
            "LaunchTemplateData.SecurityGroupIds",
            "LaunchTemplateData.IamInstanceProfile",
          ]),
        ]),
      dependencies: ec2InstanceDependencies,
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
      ignoreResource: () => pipe([() => true]),
    },
  ]);
