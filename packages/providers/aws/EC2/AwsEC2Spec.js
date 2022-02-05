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
  filter,
} = require("rubico");
const {
  first,
  unless,
  pluck,
  identity,
  includes,
  isEmpty,
  find,
  last,
  append,
  defaultsDeep,
} = require("rubico/x");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinion, DecodeUserData } = require("../AwsCommon");

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
const { EC2RouteTable } = require("./EC2RouteTable");
const { EC2RouteTableAssociation } = require("./EC2RouteTableAssociation");
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

const GROUP = "EC2";

const filterTargetDefault = pipe([omit(["TagSpecifications"])]);
const filterLiveDefault = pipe([omit(["Tags"])]);

const findDefaultWithVpcDependency = ({ resources, dependencies }) =>
  pipe([
    tap(() => {
      assert(resources);
      assert(dependencies);
      assert(dependencies.vpc);
    }),
    () => resources,
    find(
      and([
        get("isDefault"),
        eq(get("live.VpcId"), get("vpc.live.VpcId")(dependencies)),
      ])
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

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

const ec2InstanceDependencies = {
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
};

const buildAvailabilityZone = pipe([
  get("AvailabilityZone"),
  tap((params) => {
    assert(true);
  }),
  last,
  (az) => () => "`${config.region}" + az + "`",
  tap((params) => {
    assert(true);
  }),
]);

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
        pipe([
          pick(["Size", "VolumeType", "Device", "AvailabilityZone"]),
          assign({
            AvailabilityZone: buildAvailabilityZone,
          }),
        ]),
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
      //TODO only for delete
      //dependsOn: ["IAM::User", "IAM::Group"],
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
      propertiesDefault: { DnsSupport: true, DnsHostnames: false },
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
      dependencies: { vpc: { type: "Vpc", group: "EC2" } },
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
      dependencies: {
        subnet: { type: "Subnet", group: "EC2" },
        eip: { type: "ElasticIpAddress", group: "EC2" },
      },
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
      propertiesDefault: {
        MapPublicIpOnLaunch: false,
        MapCustomerOwnedIpOnLaunch: false,
      },
      filterLive: () =>
        pipe([
          pick([
            "CidrBlock",
            "Ipv6CidrBlock",
            "AvailabilityZone",
            "MapPublicIpOnLaunch",
            "CustomerOwnedIpv4Pool",
            "MapCustomerOwnedIpOnLaunch",
            "MapPublicIpOnLaunch",
          ]),
          assign({
            AvailabilityZone: buildAvailabilityZone,
          }),
        ]),
      dependencies: { vpc: { type: "Vpc", group: "EC2" } },
      //TODO remove ?
      ignoreResource: () => get("isDefault"),
    },
    {
      type: "RouteTable",
      dependsOn: ["EC2::Vpc"],
      dependsOnList: ["EC2::Vpc"],
      Client: EC2RouteTable,
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
      includeDefaultDependencies: true,
      findDefault: findDefaultWithVpcDependency,
      filterLive: () => pick([]),
      ignoreResource: (input) =>
        pipe([
          and([
            get("isDefault"),
            pipe([
              get("usedBy"),
              filter(not(get("managedByOther"))),
              tap((params) => {
                assert(true);
              }),
              isEmpty,
            ]),
          ]),
        ]),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
      },
    },
    {
      type: "RouteTableAssociation",
      dependsOn: ["EC2::RouteTable", "EC2::Subnet"],
      dependsOnList: ["EC2::RouteTable"],

      Client: EC2RouteTableAssociation,
      isOurMinion: () => () => true,
      compare: compare({
        filterTarget: filterTargetDefault,
        filterLive: pipe([
          pick(["RouteTableId", "SubnetId"]),
          filterLiveDefault,
        ]),
      }),
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ routeTable, subnet }) => {
            assert(routeTable);
            assert(subnet);
          }),
          ({ routeTable, subnet }) =>
            `rt-assoc::${routeTable.name}::${subnet.name}`,
        ])(),
      filterLive: () => pick([]),
      includeDefaultDependencies: true,
      dependencies: {
        routeTable: { type: "RouteTable", group: "EC2" },
        subnet: { type: "Subnet", group: "EC2" },
      },
    },
    {
      type: "Route",
      dependsOn: ["EC2::RouteTable", "EC2::InternetGateway", "EC2::NatGateway"],
      dependsOnList: ["EC2::RouteTable"],
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
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ routeTable }) => {
            assert(routeTable);
          }),
          ({ routeTable, ig, natGateway }) =>
            pipe([
              tap(() => {
                assert(routeTable);
              }),
              () => routeTable.name,
              tap((name) => {
                assert(name);
              }),
              switchCase([
                () => ig,
                append("-igw"),
                () => natGateway,
                append("-nat-gateway"),
                () => {
                  throw Error("missing 'ig' or 'natGateway' dependency");
                },
              ]),
            ])(),
        ])(),
      includeDefaultDependencies: true,
      dependencies: {
        routeTable: { type: "RouteTable", group: "EC2" },
        ig: { type: "InternetGateway", group: "EC2" },
        natGateway: { type: "NatGateway", group: "EC2" },
      },
    },
    {
      type: "SecurityGroup",
      dependsOn: ["EC2::Vpc", "EC2::Subnet"],
      Client: AwsSecurityGroup,
      isOurMinion,
      includeDefaultDependencies: true,
      findDefault: findDefaultWithVpcDependency,
      compare: compare({
        filterTarget: pipe([pick(["Description"]), filterTargetDefault]),
        filterLive: pipe([pick(["Description"])]),
      }),
      filterLive: () => pick(["Description"]),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        eksCluster: {
          type: "Cluster",
          group: "EKS",
        },
      },
      addCode: ({ resource, lives }) =>
        pipe([
          () => resource,
          get("dependencies"),
          find(eq(get("type"), "Cluster")),
          get("ids"),
          first,
          unless(isEmpty, (id) =>
            pipe([
              () => lives,
              find(eq(get("id"), id)),
              get("name"),
              tap((name) => {
                assert(name, "cannot found cluster");
              }),
              (name) => `
                filterLives: ({ resources }) =>
                  pipe([
                    () => resources,
                    find(
                      pipe([
                        get("live.Tags"),
                        find(
                          and([
                            eq(get("Key"), "aws:eks:cluster-name"),
                            eq(get("Value"), "${name}"),
                          ])
                        ),
                      ])
                    ),
                  ])(),`,
            ])()
          ),
        ])(),
    },
    {
      type: "SecurityGroupRuleIngress",
      dependsOn: ["EC2::SecurityGroup"],
      dependsOnList: ["EC2::SecurityGroup"],

      Client: AwsSecurityGroupRuleIngress,
      compare: compareSecurityGroupRule,
      isOurMinion,
      filterLive: securityGroupRulePickProperties,
      includeDefaultDependencies: true,
      dependencies: {
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
                eq(identity, dependency.live.GroupId),
              ])(),
        },
      },
    },
    {
      type: "SecurityGroupRuleEgress",
      dependsOn: ["EC2::SecurityGroup"],
      dependsOnList: ["EC2::SecurityGroup"],
      Client: AwsSecurityGroupRuleEgress,
      compare: compareSecurityGroupRule,
      isOurMinion,
      filterLive: securityGroupRulePickProperties,
      includeDefaultDependencies: true,
      dependencies: {
        securityGroup: { type: "SecurityGroup", group: "EC2" },
      },
    },
    {
      type: "ElasticIpAddress",
      dependsOn: ["EC2::InternetGateway", "EC2::InternetGateway"],
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
        /*"EC2::NetworkInterface",*/
        "EC2::InternetGateway",
        "IAM::InstanceProfile",
      ],
      Client: EC2Instance,
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html#runInstances-property
      propertiesDefault: {
        MaxCount: 1,
        MinCount: 1,
        Placement: { GroupName: "", Tenancy: "default" },
      },
      compare: compareEC2Instance,
      isOurMinion: isOurMinionEC2Instance,
      filterLive: () =>
        pipe([
          pick(["InstanceType", "ImageId", "UserData", "Placement"]),
          assign({
            Placement: pipe([
              get("Placement"),
              assign({
                AvailabilityZone: buildAvailabilityZone,
              }),
            ]),
          }),
          tap((params) => {
            assert(true);
          }),
          DecodeUserData,
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
      includeDefaultDependencies: true,
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
      propertiesDefault: {
        LaunchTemplateData: { EbsOptimized: false },
      },
      filterLive: () =>
        pipe([
          pick(["LaunchTemplateData"]),
          assign({
            LaunchTemplateData: pipe([
              get("LaunchTemplateData"),
              omitIfEmpty([
                "BlockDeviceMappings",
                "ElasticGpuSpecifications",
                "ElasticInferenceAccelerators",
                "SecurityGroups",
                "LicenseSpecifications",
                "TagSpecifications",
              ]),
              omit([
                "NetworkInterfaces",
                "SecurityGroupIds",
                "IamInstanceProfile",
                "KeyName",
              ]),
              DecodeUserData,
            ]),
          }),
        ]),
      dependencies: ec2InstanceDependencies,
    },

    // {
    //   type: "NetworkInterface",
    //   //dependsOn: ["EC2::Subnet", "EC2::SecurityGroup"],
    //   Client: AwsNetworkInterface,
    //   isOurMinion,
    //   compare: compare({
    //     filterTarget: pipe([filterTargetDefault]),
    //     filterLive: pipe([filterLiveDefault]),
    //   }),
    // },
    {
      type: "NetworkAcl",
      Client: AwsNetworkAcl,
      listOnly: true,
      isOurMinion,
      ignoreResource: () => pipe([() => true]),
    },
  ]);
