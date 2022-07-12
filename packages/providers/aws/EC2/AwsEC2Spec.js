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
  fork,
} = require("rubico");
const {
  includes,
  first,
  size,
  unless,
  isEmpty,
  find,
  last,
  append,
  defaultsDeep,
  when,
  isDeepEqual,
  callProp,
} = require("rubico/x");
const {
  omitIfEmpty,
  replaceWithName,
  differenceObject,
  cidrToSubnetMaskLength,
} = require("@grucloud/core/Common");
const {
  compareAws,
  isOurMinion,
  assignPolicyDocumentAccountAndRegion,
  replaceRegion,
  replaceRegionAll,
  replaceOwner,
} = require("../AwsCommon");

const {
  hasDependency,
  findLiveById,
} = require("@grucloud/core/generatorUtils");
const {
  EC2Instance,
  isOurMinionEC2Instance,
  compareEC2Instance,
} = require("./EC2Instance");
const {
  appendCidrSuffix,
  getLaunchTemplateIdFromTags,
} = require("./EC2Common");
const {
  inferNameRouteTableArm,
  transitGatewayAttachmentDependencies,
} = require("./EC2TransitGatewayCommon");

const { EC2LaunchTemplate } = require("./EC2LaunchTemplate");

const { AwsClientKeyPair } = require("./AwsKeyPair");
const { EC2Vpc } = require("./EC2Vpc");
const { EC2InternetGateway } = require("./EC2InternetGateway");
const {
  EC2InternetGatewayAttachment,
} = require("./EC2InternetGatewayAttachment");
const {
  EC2EgressOnlyInternetGateway,
} = require("./EC2EgressOnlyInternetGateway");
const { AwsNatGateway } = require("./AwsNatGateway");
const { EC2DhcpOptions } = require("./EC2DhcpOptions");
const { EC2Ipam } = require("./EC2Ipam");
const { EC2IpamScope } = require("./EC2IpamScope");
const { EC2IpamPool } = require("./EC2IpamPool");
const { EC2IpamPoolCidr } = require("./EC2IpamPoolCidr");

const { EC2DhcpOptionsAssociation } = require("./EC2DhcpOptionsAssociation");
const { EC2RouteTable } = require("./EC2RouteTable");
const { EC2RouteTableAssociation } = require("./EC2RouteTableAssociation");
const { EC2Route } = require("./EC2Route");
const {
  EC2Subnet,
  filterLiveSubnetV4,
  filterLiveSubnetV6,
  omitAssignIpv6AddressOnCreationIfIpv6Native,
} = require("./EC2Subnet");
const { AwsSecurityGroup } = require("./AwsSecurityGroup");
const {
  AwsSecurityGroupRuleIngress,
  AwsSecurityGroupRuleEgress,
  compareSecurityGroupRule,
  inferNameSecurityGroupRule,
} = require("./AwsSecurityGroupRule");
const { AwsElasticIpAddress } = require("./AwsElasticIpAddress");
const {
  EC2ElasticIpAddressAssociation,
} = require("./EC2ElasticIpAddressAssociation");
const { EC2FlowLogs } = require("./EC2FlowLogs");
const { AwsVolume, setupEbsVolume } = require("./AwsVolume");
const { EC2CustomerGateway } = require("./EC2CustomerGateway");
const { EC2ManagedPrefixList } = require("./EC2ManagedPrefixList");

const { EC2VolumeAttachment } = require("./EC2VolumeAttachment");
const { EC2NetworkInterface } = require("./AwsNetworkInterface");
const { AwsNetworkAcl } = require("./AwsNetworkAcl");
const { EC2VpcPeeringConnection } = require("./EC2VpcPeeringConnection");

const { EC2PlacementGroup } = require("./EC2PlacementGroup");

const {
  EC2VpcPeeringConnectionAccepter,
} = require("./EC2VpcPeeringConnectionAccepter");

const { EC2TransitGateway } = require("./EC2TransitGateway");
const {
  EC2TransitGatewayVpcAttachment,
} = require("./EC2TransitGatewayVpcAttachment");

const {
  EC2TransitGatewayPeeringAttachment,
} = require("./EC2TransitGatewayPeeringAttachment");

const { EC2TransitGatewayRoute } = require("./EC2TransitGatewayRoute");

const {
  EC2TransitGatewayRouteTable,
} = require("./EC2TransitGatewayRouteTable");

const {
  EC2TransitGatewayRouteTableAssociation,
} = require("./EC2TransitGatewayRouteTableAssociation");

const {
  EC2TransitGatewayRouteTablePropagation,
} = require("./EC2TransitGatewayRouteTablePropagation");

const { EC2VpcEndpoint } = require("./EC2VpcEndpoint");
const { EC2VpnGateway } = require("./EC2VpnGateway");
const { EC2VpnConnection } = require("./EC2VpnConnection");

const GROUP = "EC2";

const getTargetTags = pipe([get("TagSpecifications"), first, get("Tags")]);

const compareEC2 = compareAws({
  getTargetTags,
  omitTargetKey: "TagSpecifications",
});

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
  ])();

const omitPort = ({ port }) => when(eq(get(port), -1), omit([port]));

const securityGroupRulePickProperties = pipe([
  ({ resource }) =>
    pipe([
      when(
        () => hasDependency({ type: "SecurityGroup", group: "EC2" })(resource),
        omit(["IpPermission.UserIdGroupPairs"])
      ),
      pick(["IpPermission"]),
      omitPort({ port: "FromPort" }),
      omitPort({ port: "ToPort" }),
    ]),
]);

const ec2InstanceDependencies = {
  subnets: {
    type: "Subnet",
    group: "EC2",
    list: true,
  },
  keyPair: { type: "KeyPair", group: "EC2" },
  iamInstanceProfile: { type: "InstanceProfile", group: "IAM" },
  securityGroups: {
    type: "SecurityGroup",
    group: "EC2",
    list: true,
  },
  placementGroup: { type: "PlacementGroup", group: "EC2" },
};

const buildAvailabilityZone = pipe([
  get("AvailabilityZone"),
  last,
  (az) => () => "`${config.region}" + az + "`",
]);

const securityGroupRuleDependencies = {
  securityGroup: {
    type: "SecurityGroup",
    group: "EC2",
    parent: true,
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
    list: true,
    filterDependency:
      ({ resource }) =>
      (dependency) =>
        pipe([
          () => resource,
          tap(() => {
            assert(dependency.live.GroupId);
            assert(resource.live.GroupId);
          }),
          get("live.IpPermission.UserIdGroupPairs"),
          any(eq(get("GroupId"), dependency.live.GroupId)),
        ])(),
  },
};

const sortByFromPort = pipe([
  callProp("sort", (a, b) => a.FromPort - b.FromPort),
]);

const getIpPermissions =
  ({ type, targetResources, lives, config }) =>
  ({ GroupName, VpcId }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(targetResources);
        assert(lives);
        assert(GroupName);
        assert(VpcId);
        assert(config);
      }),
      () => targetResources,
      tap((params) => {
        assert(Array.isArray(targetResources));
      }),
      filter(eq(get("type"), type)),
      filter(
        eq(
          ({ dependencies }) =>
            pipe([
              dependencies,
              get("securityGroup.name"),
              callProp("split", "::"),
              ([sg, vpcName]) =>
                pipe([
                  () =>
                    lives.getByName({
                      name: vpcName,
                      type: "Vpc",
                      group: "EC2",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])(),
              tap((vpcName) => {
                assert(vpcName);
              }),
            ])(),
          VpcId
        )
      ),
      filter(
        eq(
          ({ dependencies }) =>
            pipe([
              dependencies,
              get("securityGroup.name"),
              callProp("split", "::"),
              last,
            ])(),
          GroupName
        )
      ),
      map(({ properties }) =>
        pipe([
          () => properties({}),
          get("IpPermission"),
          omit(["UserIdGroupPairs"]),
        ])()
      ),
      sortByFromPort,
    ])();

const filterPermissions = pipe([
  map(
    pipe([
      omitIfEmpty(["PrefixListIds", "Ipv6Ranges", "IpRanges"]),
      omit(["UserIdGroupPairs"]),
    ])
  ),
  sortByFromPort,
]);

const assignIpamRegion = ({ providerConfig }) =>
  assign({
    IpamRegion: pipe([get("IpamRegion"), replaceRegion({ providerConfig })]),
  });

const assignLocale = ({ providerConfig }) =>
  when(
    get("Locale"),
    assign({
      Locale: pipe([get("Locale"), replaceRegion({ providerConfig })]),
    })
  );
const omitLocaleNone = when(eq(get("Locale"), "None"), omit(["Locale"]));

const getByIdFromLives =
  ({ lives, groupType }) =>
  (id) =>
    pipe([
      () => lives,
      find(and([eq(get("groupType"), groupType), eq(get("id"), id)])),
    ])();

const omitNetworkInterfacesForDefaultSubnetAndSecurityGroup = ({ lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
    }),
    get("NetworkInterfaces"),
    and([
      eq(size, 1),
      pipe([
        first,
        and([
          // default subnet ?
          pipe([
            get("SubnetId"),
            getByIdFromLives({ lives, groupType: "EC2::Subnet" }),
            tap((params) => {
              assert(true);
            }),
            get("isDefault"),
          ]),
          // only one default security group ?
          pipe([
            get("Groups"),
            and([
              eq(size, 1),
              pipe([
                first,
                get("GroupId"),
                getByIdFromLives({ lives, groupType: "EC2::SecurityGroup" }),
                get("isDefault"),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ]);

const getLaunchTemplateVersionFromTags = pipe([
  get("Tags"),
  find(eq(get("Key"), "aws:ec2launchtemplate:version")),
  get("Value"),
]);

const replacePeeringInfo = ({ resourceType, providerConfig }) =>
  pipe([
    get(resourceType),
    assign({
      OwnerId: pipe([get("OwnerId"), replaceOwner({ providerConfig })]),
      Region: pipe([get("Region"), replaceRegionAll({ providerConfig })]),
    }),
  ]);

module.exports = pipe([
  () => [
    {
      type: "CustomerGateway",
      Client: EC2CustomerGateway,
      omitProperties: ["CustomerGatewayId", "CertificateArn", "State"],
      ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
      propertiesDefault: { Type: "ipsec.1" },
      compare: compareEC2({ filterAll: () => pick([]) }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      dependencies: {
        certificate: { type: "Certificate", group: "ACM" },
      },
    },
    {
      type: "DhcpOptions",
      Client: EC2DhcpOptions,
      omitProperties: ["DhcpOptionsId", "OwnerId"],
    },
    {
      type: "DhcpOptionsAssociation",
      Client: EC2DhcpOptionsAssociation,
      omitProperties: ["DhcpOptionsId", "VpcId"],
      inferName: ({ dependenciesSpec: { vpc, dhcpOptions } }) =>
        pipe([() => `dhcp-options-assoc::${vpc}::${dhcpOptions}`])(),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2", parent: true },
        dhcpOptions: { type: "DhcpOptions", group: "EC2", parent: true },
      },
    },
    {
      type: "FlowLogs",
      Client: EC2FlowLogs,
      propertiesDefault: {
        LogFormat:
          "${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status}",
      },
      omitProperties: [
        "ResourceId",
        "CreationTime",
        "DeliverLogsPermissionArn",
        "DeliverLogsStatus",
        "DeliverLogsErrorMessage",
        "LogGroupName",
        "FlowLogId",
        "FlowLogStatus",
        "LogDestinationType",
        "LogDestination",
      ],
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        subnet: { type: "Subnet", group: "EC2" },
        networkInterface: { type: "NetworkInterface", group: "EC2" },
        iamRole: { type: "Role", group: "IAM" },
        cloudWatchLogGroup: { type: "LogGroup", group: "CloudWatchLogs" },
        s3Bucket: { type: "Bucket", group: "S3" },
      },
      includeDefaultDependencies: true,
      compare: compareEC2({
        filterTarget: () => pipe([omit(["ResourceIds", "ResourceType"])]),
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(
            eq(get("LogDestinationType"), "s3"),
            pipe([
              assign({
                LogDestination: pipe([
                  get("LogDestination"),
                  replaceWithName({
                    groupType: "S3::Bucket",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              }),
            ])
          ),
        ]),
    },
    {
      type: "Ipam",
      Client: EC2Ipam,
      omitProperties: [
        "IpamArn",
        "IpamId",
        "PublicDefaultScopeId",
        "PrivateDefaultScopeId",
        "ScopeCount",
        "OwnerId",
        "State",
      ],
      filterLive: ({ providerConfig }) =>
        pipe([
          assignIpamRegion({ providerConfig }),
          assign({
            OperatingRegions: pipe([
              get("OperatingRegions"),
              map(
                assign({
                  RegionName: pipe([
                    get("RegionName"),
                    replaceRegion({ providerConfig }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    {
      type: "IpamScope",
      Client: EC2IpamScope,
      omitProperties: [
        "OwnerId",
        "IpamId",
        "IpamScopeId",
        "IpamScopeArn",
        "IpamArn",
        "State",
        "PoolCount",
      ],
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assignIpamRegion({ providerConfig }),
        ]),
      dependencies: {
        ipam: { type: "Ipam", group: "EC2" },
      },
    },
    {
      type: "IpamPool",
      Client: EC2IpamPool,
      includeDefaultDependencies: true,
      omitProperties: [
        "SourceIpamPoolId",
        "IpamArn",
        "IpamPoolArn",
        "IpamPoolId",
        "IpamScopeId",
        "IpamScopeArn",
        "PoolDepth",
        "OwnerId",
        "State",
        "Allocations",
      ],
      compare: compareEC2({
        filterLive: () => pipe([omitLocaleNone]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          assignIpamRegion({ providerConfig }),
          omitLocaleNone,
          assignLocale({ providerConfig }),
        ]),
      dependencies: {
        ipamPoolSource: { type: "IpamPool", group: "EC2" },
        ipamScope: { type: "IpamScope", group: "EC2" },
      },
    },
    {
      type: "IpamPoolCidr",
      Client: EC2IpamPoolCidr,
      omitProperties: ["IpamPoolId", "State", "FailureReason"],
      inferName: pipe([get("properties.Cidr")]),
      dependencies: {
        ipamPool: { type: "IpamPool", group: "EC2", parent: true },
      },
    },
    {
      type: "KeyPair",
      Client: AwsClientKeyPair,
      propertiesDefault: { KeyType: "rsa" },
      omitProperties: ["KeyPairId", "KeyFingerprint", "CreateTime"],
      filterLive: () => pick([]),
    },
    {
      type: "NetworkInterface",
      Client: EC2NetworkInterface,
      omitProperties: ["Attachment", ""],
      filterLive: () => pipe([pick(["Description"])]),
      dependencies: {
        instance: { type: "Instance", group: "EC2" },
      },
    },
    {
      type: "Volume",
      Client: AwsVolume,
      dependencies: {
        instance: { type: "Instance", group: "EC2", parent: true },
      },
      omitProperties: [
        "Attachments",
        "CreateTime",
        "Encrypted",
        "SnapshotId",
        "State",
        "VolumeId",
        "Device",
      ],
      propertiesDefault: {
        MultiAttachEnabled: false,
      },
      setupEbsVolume,
      filterLive: () =>
        pipe([
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
      type: "VolumeAttachment",
      Client: EC2VolumeAttachment,
      dependencies: {
        volume: { type: "Volume", group: "EC2", parent: true },
        instance: { type: "Instance", group: "EC2", parent: true },
      },
      isOurMinion: () => true,
      compare: compareAws({ getLiveTags: () => [], getTargetTags: () => [] })({
        filterAll: () => pipe([pick([])]),
      }),
      inferName: ({ properties, dependenciesSpec: { volume, instance } }) =>
        pipe([
          tap(() => {
            assert(volume);
            assert(instance);
          }),
          () => `vol-attachment::${volume}::${instance}`,
        ])(),
      filterLive: () => pipe([pick(["Device", "DeleteOnTermination"])]),
    },
    {
      type: "Vpc",
      //TODO only for delete
      //dependsOnDelete: ["IAM::User", "IAM::Group"],
      Client: EC2Vpc,
      omitProperties: [
        "DhcpOptionsId",
        "State",
        "OwnerId",
        "InstanceTenancy",
        "Ipv6CidrBlockAssociationSet",
        "CidrBlockAssociationSet",
        "IsDefault",
        "VpcId",
        "Ipv4IpamPoolId",
      ],
      dependencies: {
        ipamPoolIpv4: {
          type: "IpamPool",
          group: "EC2",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([() => resource, get("live.CidrBlock")])(),
        },
        // TODO ipamPoolIpv6
        // ipamPoolIpv6: {
        //   type: "IpamPool",
        //   group: "EC2",
        //   filterDependency:
        //     ({ resource }) =>
        //     (dependency) =>
        //       pipe([
        //         () => resource,
        //         get("live.Ipv6CidrBlockAssociationSet[0].Ipv6CidrBlock"),
        //       ])(),
        //},
      },
      propertiesDefault: { DnsSupport: true, DnsHostnames: false },
      compare: compareEC2({
        filterAll: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["CidrBlock"]),
          ]),
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "AmazonProvidedIpv6CidrBlock",
              "Ipv4NetmaskLength",
              // TODO
              "Ipv6NetmaskLength",
            ]),
          ]),
      }),
      filterLive: ({ resource }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(
            pipe([
              () => resource.dependencies,
              find(eq(get("groupType"), "EC2::IpamPool")),
              get("ids"),
              not(isEmpty),
            ]),
            pipe([
              when(
                get("CidrBlock"),
                assign({
                  Ipv4NetmaskLength: pipe([
                    get("CidrBlock"),
                    cidrToSubnetMaskLength,
                  ]),
                })
              ),
              omit(["CidrBlock"]),
              tap((params) => {
                assert(true);
              }),
            ])
          ),
          // TODO ipv6
          when(
            pipe([
              get("Ipv6CidrBlockAssociationSet"),
              first,
              eq(get("Ipv6Pool"), "Amazon"),
            ]),
            assign({ AmazonProvidedIpv6CidrBlock: () => true })
          ),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "InternetGateway",
      Client: EC2InternetGateway,
      omitProperties: ["Attachments", "InternetGatewayId", "OwnerId"],
    },
    {
      type: "InternetGatewayAttachment",
      Client: EC2InternetGatewayAttachment,
      omitProperties: ["VpcId", "InternetGatewayId"],
      inferName: ({ dependenciesSpec: { vpc, internetGateway } }) =>
        `ig-attach::${internetGateway}::${vpc}`,
      dependencies: {
        vpc: { type: "Vpc", group: "EC2", parent: true },
        internetGateway: {
          type: "InternetGateway",
          group: "EC2",
          parent: true,
        },
      },
    },
    {
      type: "EgressOnlyInternetGateway",
      Client: EC2EgressOnlyInternetGateway,
      omitProperties: [
        "Attachments",
        "EgressOnlyInternetGatewayId",
        "OwnerId",
        "VpcId",
      ],
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
      },
    },
    {
      type: "NatGateway",
      Client: AwsNatGateway,
      omitProperties: [
        "CreateTime",
        "NatGatewayAddresses",
        "NatGatewayId",
        "State",
        "VpcId",
        "ConnectivityType",
        "DeleteTime",
        "FailureCode",
        "FailureMessage",
        "AllocationId",
      ],
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
      Client: EC2Subnet,
      includeDefaultDependencies: true,
      omitProperties: [
        "VpcId",
        "AvailabilityZoneId",
        "AvailableIpAddressCount",
        "DefaultForAz",
        "State",
        "SubnetId",
        "OwnerId",
        "Ipv6CidrBlockAssociationSet",
        "SubnetArn",
        "OutpostArn",
        //TODO
        "PrivateDnsNameOptionsOnLaunch",
        "CidrBlock",
      ],
      propertiesDefault: {
        MapPublicIpOnLaunch: false,
        MapCustomerOwnedIpOnLaunch: false,
        AssignIpv6AddressOnCreation: false,
        EnableDns64: false,
        Ipv6Native: false,
        //TODO
        // PrivateDnsNameOptionsOnLaunch: {
        //   HostnameType: "ip-name",
        //   EnableResourceNameDnsARecord: false,
        //   EnableResourceNameDnsAAAARecord: false,
        // },
      },
      compare: compareEC2({
        filterAll: () => pipe([omitAssignIpv6AddressOnCreationIfIpv6Native]),
        filterLive: () =>
          pipe([
            when(
              get("Ipv6CidrBlockAssociationSet"),
              assign({
                Ipv6CidrBlock: pipe([
                  get("Ipv6CidrBlockAssociationSet"),
                  first,
                  get("Ipv6CidrBlock"),
                  tap((params) => {
                    assert(true);
                  }),
                ]),
              })
            ),
          ]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          omitAssignIpv6AddressOnCreationIfIpv6Native,
          filterLiveSubnetV4({ lives, providerConfig }),
          filterLiveSubnetV6,
          assign({
            AvailabilityZone: buildAvailabilityZone,
          }),
        ]),
      findDefault: ({ name, resources, dependencies }) =>
        pipe([
          tap(() => {
            assert(name);
            assert(resources);
            assert(dependencies);
            assert(dependencies.vpc);
          }),
          () => resources,
          find(and([get("isDefault"), eq(get("name"), name)])),
          tap((params) => {
            assert(true);
          }),
        ])(),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        internetGateway: { type: "InternetGateway", group: "EC2" },
      },
    },
    {
      type: "RouteTable",
      Client: EC2RouteTable,
      omitProperties: [
        "VpcId",
        "Associations",
        "PropagatingVgws",
        "RouteTableId",
        "OwnerId",
        "Routes",
      ],
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
        vpc: { type: "Vpc", group: "EC2", parent: true },
      },
    },
    {
      type: "RouteTableAssociation",
      Client: EC2RouteTableAssociation,
      isOurMinion: () => () => true,
      compare: compareAws({
        getTargetTags: () => [],
        getLiveTags: () => [],
      })({
        filterLive: () => pipe([pick(["RouteTableId", "SubnetId"])]),
      }),
      inferName: ({ properties, dependenciesSpec: { routeTable, subnet } }) =>
        pipe([
          tap(() => {
            assert(routeTable);
            assert(subnet);
          }),
          () => `rt-assoc::${routeTable}::${subnet}`,
        ])(),
      filterLive: () => pick([]),
      includeDefaultDependencies: true,
      dependencies: {
        routeTable: { type: "RouteTable", group: "EC2", parent: true },
        subnet: { type: "Subnet", group: "EC2" },
      },
    },
    {
      type: "Route",
      Client: EC2Route,
      ignoreResource: () => pipe([get("isDefault")]),
      compare: compareAws({
        getTargetTags: () => [],
        getLiveTags: () => [],
      })({
        filterAll: () =>
          pipe([omit(["Origin", "State", "DestinationPrefixListId"])]),
        filterTarget:
          () =>
          ({ VpcEndpointId, ...others }) =>
            pipe([
              () => others,
              when(
                () => VpcEndpointId,
                defaultsDeep({ GatewayId: VpcEndpointId })
              ),
            ])(),
      }),
      filterLive: () =>
        pipe([pick(["DestinationCidrBlock", "DestinationIpv6CidrBlock"])]),
      inferName: ({
        properties,
        dependenciesSpec: {
          routeTable,
          ig,
          natGateway,
          vpcEndpoint,
          transitGateway,
          egressOnlyInternetGateway,
        },
      }) =>
        pipe([
          tap(() => {
            assert(routeTable);
          }),
          () => routeTable,
          switchCase([
            () => ig,
            pipe([append("-igw")]),
            () => natGateway,
            pipe([append("-nat-gateway")]),
            () => vpcEndpoint,
            pipe([append(`-${vpcEndpoint}`)]),
            () => transitGateway,
            pipe([append(`-tgw`)]),
            () => egressOnlyInternetGateway,
            pipe([append(`-eogw`)]),
            pipe([append("-local")]),
          ]),
          appendCidrSuffix(properties),
        ])(),
      includeDefaultDependencies: true,
      dependencies: {
        routeTable: { type: "RouteTable", group: "EC2", parent: true },
        ig: { type: "InternetGateway", group: "EC2", parent: true },
        natGateway: { type: "NatGateway", group: "EC2", parent: true },
        vpcEndpoint: { type: "VpcEndpoint", group: "EC2", parent: true },
        transitGateway: { type: "TransitGateway", group: "EC2", parent: true },
        egressOnlyInternetGateway: {
          type: "EgressOnlyInternetGateway",
          group: "EC2",
          parent: true,
        },
      },
    },
    {
      type: "SecurityGroup",
      Client: AwsSecurityGroup,
      includeDefaultDependencies: true,
      findDefault: findDefaultWithVpcDependency,
      compare: compareEC2({
        filterTarget: ({ lives, config, targetResources }) =>
          pipe([
            tap((params) => {
              assert(targetResources);
              assert(lives);
            }),
            assign({
              IpPermissions: getIpPermissions({
                type: "SecurityGroupRuleIngress",
                targetResources,
                lives,
                config,
              }),
              IpPermissionsEgress: getIpPermissions({
                type: "SecurityGroupRuleEgress",
                targetResources,
                lives,
                config,
              }),
            }),
          ]),
        filterLive: () =>
          pipe([
            assign({
              IpPermissions: pipe([get("IpPermissions"), filterPermissions]),
              IpPermissionsEgress: pipe([
                get("IpPermissionsEgress"),
                filterPermissions,
                filter(
                  pipe([
                    assign({
                      IpRanges: pipe([
                        get("IpRanges"),
                        map(omit(["Description"])),
                      ]),
                    }),
                    (rule) =>
                      !isDeepEqual(rule, {
                        FromPort: undefined,
                        IpProtocol: "-1",
                        IpRanges: [{ CidrIp: "0.0.0.0/0" }],
                        ToPort: undefined,
                      }),
                  ])
                ),
              ]),
            }),
          ]),
        filterAll: () => pipe([omit(["VpcId", "OwnerId", "GroupId"])]),
      }),
      filterLive: () => pick(["GroupName", "Description"]),
      inferName: ({ properties, dependenciesSpec: { vpc } }) =>
        pipe([
          () => "sg::",
          when(() => vpc, append(`${vpc}::`)),
          switchCase([
            () => properties.GroupName,
            append(properties.GroupName),
            append("default"),
          ]),
        ])(),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        subnet: { type: "Subnet", group: "EC2" },
        eksCluster: {
          type: "Cluster",
          group: "EKS",
          ignoreOnDestroy: true,
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
      Client: AwsSecurityGroupRuleIngress,
      compare: compareSecurityGroupRule,
      filterLive: securityGroupRulePickProperties,
      includeDefaultDependencies: true,
      dependencies: securityGroupRuleDependencies,
      inferName: inferNameSecurityGroupRule({ kind: "ingress" }),
    },
    {
      type: "SecurityGroupRuleEgress",
      Client: AwsSecurityGroupRuleEgress,
      compare: compareSecurityGroupRule,
      filterLive: securityGroupRulePickProperties,
      includeDefaultDependencies: true,
      dependencies: securityGroupRuleDependencies,
      inferName: inferNameSecurityGroupRule({ kind: "egress" }),
    },
    {
      type: "ElasticIpAddress",
      dependencies: {
        internetGateway: { type: "InternetGateway", group: "EC2" },
      },
      Client: AwsElasticIpAddress,
      omitProperties: [
        "InstanceId",
        "PublicIp",
        "AllocationId",
        "AssociationId",
        "NetworkInterfaceId",
        "NetworkInterfaceOwnerId",
        "PrivateIpAddress",
        "PublicIpv4Pool",
        "NetworkBorderGroup",
      ],
      filterLive: () => pick([]),
    },
    {
      type: "ElasticIpAddressAssociation",
      Client: EC2ElasticIpAddressAssociation,
      dependencies: {
        eip: { type: "ElasticIpAddress", group: "EC2", parent: true },
        instance: { type: "Instance", group: "EC2", parent: true },
      },
      omitProperties: ["InstanceId", "AllocationId", "AssociationId"],
      inferName: ({ properties, dependenciesSpec: { eip, instance } }) =>
        pipe([
          tap(() => {
            assert(eip);
            assert(instance);
          }),
          () => `eip-attach::${eip}::${instance}`,
        ])(),
    },
    {
      type: "Instance",
      Client: EC2Instance,
      includeDefaultDependencies: true,
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html#runInstances-property
      propertiesDefault: {
        MaxCount: 1,
        MinCount: 1,
        Placement: { GroupName: "", Tenancy: "default" },
        Monitoring: {
          State: "disabled",
        },
        EbsOptimized: false,
        EnaSupport: true,
        SourceDestCheck: true,
        // The t2.micro instance type does not support specifying CpuOptions.
        // CpuOptions: {
        //   CoreCount: 1,
        //   ThreadsPerCore: 1,
        // },
        CapacityReservationSpecification: {
          CapacityReservationPreference: "open",
        },
        HibernationOptions: {
          Configured: false,
        },
        MetadataOptions: {
          HttpTokens: "optional",
          HttpPutResponseHopLimit: 1,
          HttpEndpoint: "enabled",
          HttpProtocolIpv6: "disabled",
          InstanceMetadataTags: "disabled",
        },
        EnclaveOptions: {
          Enabled: false,
        },
        MaintenanceOptions: {
          AutoRecovery: "default",
        },
      },
      compare: compareEC2Instance,
      isOurMinion: isOurMinionEC2Instance,
      omitProperties: [
        "KeyName",
        "PublicIpAddress",
        "AmiLaunchIndex",
        "ImageId",
        "InstanceId",
        "VpcId",
        "LaunchTime",
        "PrivateDnsName",
        "PrivateIpAddress",
        "ProductCodes",
        "PublicDnsName",
        "State",
        "StateTransitionReason",
        "SubnetId",
        "Architecture",
        "ClientToken",
        "IamInstanceProfile",
        "SecurityGroups",
        "PlatformDetails",
        "UsageOperation",
        "UsageOperationUpdateTime",
        "RootDeviceName",
        "RootDeviceType",
        "PrivateDnsNameOptions",
        "MetadataOptions.State",
        "BlockDeviceMappings",
        "VirtualizationType",
        "Hypervisor",
        "CpuOptions",
      ],
      filterLive:
        ({ lives, providerConfig }) =>
        (live) =>
          pipe([
            () => live,
            differenceObject(
              pipe([
                () => live,
                getLaunchTemplateIdFromTags,
                getByIdFromLives({ lives, groupType: "EC2::LaunchTemplate" }),
                get("live.LaunchTemplateData"),
              ])()
            ),
            tap((params) => {
              assert(true);
            }),
            switchCase([
              or([
                pipe([
                  getLaunchTemplateIdFromTags,
                  getByIdFromLives({ lives, groupType: "EC2::LaunchTemplate" }),
                  get("live.LaunchTemplateData.SecurityGroupIds"),
                ]),
                omitNetworkInterfacesForDefaultSubnetAndSecurityGroup({
                  lives,
                }),
              ]),
              omit(["NetworkInterfaces"]),
              assign({
                NetworkInterfaces: pipe([
                  get("NetworkInterfaces"),
                  map((networkInterface) =>
                    pipe([
                      () => networkInterface,
                      when(
                        get("Description"),
                        assign({ Description: get("Description") })
                      ),
                      fork({
                        DeviceIndex: get("Attachment.DeviceIndex"),
                        Groups: pipe([
                          get("Groups"),
                          map(
                            pipe([
                              get("GroupId"),
                              replaceWithName({
                                groupType: "EC2::SecurityGroup",
                                path: "id",
                                providerConfig,
                                lives,
                              }),
                            ])
                          ),
                        ]),
                        SubnetId: pipe([
                          get("SubnetId"),
                          replaceWithName({
                            groupType: "EC2::Subnet",
                            path: "id",
                            providerConfig,
                            lives,
                          }),
                        ]),
                      }),
                    ])()
                  ),
                ]),
              }),
            ]),
            when(
              getLaunchTemplateIdFromTags,
              assign({
                LaunchTemplate: pipe([
                  fork({
                    LaunchTemplateId: pipe([
                      getLaunchTemplateIdFromTags,
                      replaceWithName({
                        groupType: "EC2::LaunchTemplate",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                    Version: getLaunchTemplateVersionFromTags,
                  }),
                ]),
              })
            ),
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
          ])(),
      dependencies: {
        ...ec2InstanceDependencies,
        launchTemplate: { type: "LaunchTemplate", group: "EC2" },
      },
    },
    {
      type: "LaunchTemplate",
      Client: EC2LaunchTemplate,
      includeDefaultDependencies: true,
      compare: compareEC2({
        filterTarget: () => pipe([omit(["LaunchTemplateData"])]),
        filterLive: () =>
          pipe([
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
          ]),
      }),
      propertiesDefault: {
        LaunchTemplateData: { EbsOptimized: false },
      },
      filterLive: ({ lives, providerConfig }) =>
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
                "SecurityGroupIds",
                "ImageId",
                "IamInstanceProfile",
                "KeyName",
              ]),
              when(
                get("NetworkInterfaces"),
                assign({
                  NetworkInterfaces: pipe([
                    get("NetworkInterfaces"),
                    map(
                      pipe([
                        assign({
                          Groups: pipe([
                            get("Groups"),
                            map(
                              pipe([
                                replaceWithName({
                                  groupType: "EC2::SecurityGroup",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                }),
                              ])
                            ),
                          ]),
                          SubnetId: pipe([
                            get("SubnetId"),
                            replaceWithName({
                              groupType: "EC2::Subnet",
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      dependencies: ec2InstanceDependencies,
    },
    {
      type: "NetworkAcl",
      Client: AwsNetworkAcl,
      listOnly: true,
      ignoreResource: () => pipe([() => true]),
    },
    {
      type: "ManagedPrefixList",
      dependencies: {},
      Client: EC2ManagedPrefixList,
      compare: compareEC2({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      filterLive: () => pipe([pick(["AddressFamily"])]),
    },
    {
      type: "PlacementGroup",
      dependencies: {},
      Client: EC2PlacementGroup,
      omitProperties: ["State", "GroupId", "GroupArn", "PartitionCount"],
      inferName: pipe([get("properties.GroupName")]),
      //filterLive: () => pipe([]),
    },
    {
      type: "VpcEndpoint",
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        // Interface endpoint
        subnets: { type: "Subnet", group: "EC2", list: true },
        // Gateway endpoint
        routeTables: { type: "RouteTable", group: "EC2", list: true },
        // NetworkInterfaceIds ?
        // SecurityGroup ?
        firewall: {
          type: "Firewall",
          group: "NetworkFirewall",
          parent: true,
          ignoreOnDestroy: true,
        },
        iamRoles: { type: "Role", group: "IAM", list: true },
      },
      Client: EC2VpcEndpoint,
      compare: compareEC2({
        filterTarget: () => pipe([pick(["PolicyDocument"])]),
        filterLive: () => pipe([pick(["PolicyDocument"])]),
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          pick([
            "PolicyDocument",
            "PrivateDnsEnabled",
            "RequesterManaged",
            "VpcEndpointType",
            "ServiceName",
          ]),
          assign({
            ServiceName: pipe([
              get("ServiceName"),
              replaceRegion({ providerConfig }),
            ]),
          }),
          assignPolicyDocumentAccountAndRegion({ providerConfig, lives }),
        ]),
      addCode: ({ resource, lives }) =>
        pipe([
          () => resource,
          get("dependencies"),
          find(eq(get("type"), "Firewall")),
          get("ids"),
          first,
          unless(isEmpty, () => `\n`),
        ])(),
    },
    {
      type: "VpcPeeringConnection",
      Client: EC2VpcPeeringConnection,
      ignoreResource: () =>
        pipe([
          get("live.Status.Code"),
          (code) => pipe([() => ["deleted", "failed"], includes(code)])(),
        ]),

      inferName: ({ properties, dependenciesSpec: { vpc, vpcPeer } }) =>
        pipe([
          tap((params) => {
            assert(properties);
          }),
          () => `vpc-peering::${vpc}::${vpcPeer}`,
        ])(),
      omitProperties: [
        "Status",
        "ExpirationTime",
        "VpcPeeringConnectionId",
        "AccepterVpcInfo.VpcId",
        "RequesterVpcInfo.CidrBlock",
        "RequesterVpcInfo.CidrBlockSet",
        "RequesterVpcInfo.PeeringOptions",
        "RequesterVpcInfo.VpcId",
      ],
      filterLive: ({ providerConfig }) =>
        pipe([
          assign({
            RequesterVpcInfo: replacePeeringInfo({
              resourceType: "RequesterVpcInfo",
              providerConfig,
            }),
            AccepterVpcInfo: replacePeeringInfo({
              resourceType: "AccepterVpcInfo",
              providerConfig,
            }),
          }),
        ]),
      compare: compareEC2({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                eq(get("live.RequesterVpcInfo.VpcId"), dependency.live.VpcId),
              ])(),
        },
        vpcPeer: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                eq(get("live.AccepterVpcInfo.VpcId"), dependency.live.VpcId),
              ])(),
        },
      },
    },
    {
      type: "VpcPeeringConnectionAccepter",
      Client: EC2VpcPeeringConnectionAccepter,
      inferName: ({ dependenciesSpec: { vpcPeeringConnection } }) =>
        pipe([
          tap((params) => {
            assert(vpcPeeringConnection);
          }),
          () => `vpc-peering-accepter::${vpcPeeringConnection}`,
        ])(),
      omitProperties: [
        "Status",
        "VpcPeeringConnectionId",
        "AccepterVpcInfo",
        "RequesterVpcInfo",
      ],
      ignoreResource: () =>
        pipe([
          get("live.Status.Code"),
          (code) => pipe([() => ["deleted", "failed"], includes(code)])(),
        ]),
      filterLive: ({ providerConfig }) => pipe([pick([])]),
      compare: compareEC2({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      dependencies: {
        vpcPeeringConnection: {
          type: "VpcPeeringConnection",
          group: "EC2",
          parent: true,
        },
      },
    },
    {
      type: "TransitGateway",
      Client: EC2TransitGateway,
      omitProperties: [
        "TransitGatewayId",
        "TransitGatewayArn",
        "State",
        "OwnerId",
        "CreationTime",
        "Options.AssociationDefaultRouteTableId",
        "Options.PropagationDefaultRouteTableId",
      ],
    },
    {
      type: "TransitGatewayRoute",
      Client: EC2TransitGatewayRoute,
      includeDefaultDependencies: true,
      omitProperties: [
        "TransitGatewayRouteTableId",
        "TransitGatewayAttachmentId",
        "TransitGatewayId",
        "State",
        "CreationTime",
      ],
      dependencies: {
        transitGatewayRouteTable: {
          type: "TransitGatewayRouteTable",
          group: "EC2",
          parent: true,
        },
        ...transitGatewayAttachmentDependencies,
      },
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => ({ properties, dependenciesSpec }),
          inferNameRouteTableArm({ prefix: "tgw-route" }),
          append(`::${properties.DestinationCidrBlock}`),
        ])(),
    },
    {
      type: "TransitGatewayRouteTable",
      Client: EC2TransitGatewayRouteTable,
      omitProperties: [
        "TransitGatewayRouteTableId",
        "TransitGatewayId",
        "CreationTime",
        "State",
      ],
      dependencies: {
        transitGateway: { type: "TransitGateway", group: "EC2" },
      },
    },
    {
      type: "TransitGatewayPeeringAttachment",
      Client: EC2TransitGatewayPeeringAttachment,
      includeDefaultDependencies: true,
      // inferName: pipe([
      //   get("dependenciesSpec"),
      //   tap(({ transitGateway, transitGatewayPeer }) => {
      //     assert(transitGateway);
      //     assert(transitGatewayPeer);
      //   }),
      //   ({ transitGateway, transitGatewayPeer }) =>
      //     `tgw-peering-attach::${transitGateway}::${transitGatewayPeer}`,
      // ]),
      // TODO remove this
      compare: compareEC2({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
      omitProperties: [
        "TransitGatewayAttachmentId",
        "RequesterTgwInfo.TransitGatewayId",
        "AccepterTgwInfo.TransitGatewayId",
        "Status",
        "State",
        "CreationTime",
      ],
      dependencies: {
        transitGateway: {
          type: "TransitGateway",
          group: "EC2",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                tap((params) => {
                  assert(dependency);
                }),
                () => resource,
                eq(
                  get("live.RequesterTgwInfo.TransitGatewayId"),
                  dependency.live.TransitGatewayId
                ),
              ])(),
        },
        transitGatewayPeer: {
          type: "TransitGateway",
          group: "EC2",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                tap((params) => {
                  assert(dependency);
                }),
                () => resource,
                eq(
                  get("live.AccepterTgwInfo.TransitGatewayId"),
                  dependency.live.TransitGatewayId
                ),
                tap((params) => {
                  assert(true);
                }),
              ])(),
        },
      },
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            RequesterTgwInfo: replacePeeringInfo({
              resourceType: "RequesterTgwInfo",
              providerConfig,
            }),
            AccepterTgwInfo: replacePeeringInfo({
              resourceType: "AccepterTgwInfo",
              providerConfig,
            }),
          }),
        ]),
    },
    {
      type: "TransitGatewayVpcAttachment",
      Client: EC2TransitGatewayVpcAttachment,
      includeDefaultDependencies: true,
      // TODO remove this
      ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
      omitProperties: [
        "TransitGatewayAttachmentId",
        "TransitGatewayId",
        "VpcId",
        "VpcOwnerId",
        "SubnetIds",
        "CreationTime",
        "State",
      ],
      dependencies: {
        transitGateway: {
          type: "TransitGateway",
          group: "EC2",
        },
        vpc: { type: "Vpc", group: "EC2" },
        subnets: { type: "Subnet", group: "EC2", list: true },
        transitGatewayRouteTables: {
          type: "TransitGatewayRouteTable",
          group: "EC2",
          list: true,
        },
      },
    },
    {
      type: "TransitGatewayRouteTableAssociation",
      Client: EC2TransitGatewayRouteTableAssociation,
      includeDefaultDependencies: true,
      omitProperties: [
        "TransitGatewayAttachmentId",
        "TransitGatewayRouteTableId",
      ],
      inferName: inferNameRouteTableArm({ prefix: "tgw-rtb-assoc" }),
      compare: compareAws({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      dependencies: {
        transitGatewayRouteTable: {
          type: "TransitGatewayRouteTable",
          group: "EC2",
          parent: true,
        },
        ...transitGatewayAttachmentDependencies,
      },
    },
    {
      type: "TransitGatewayRouteTablePropagation",
      Client: EC2TransitGatewayRouteTablePropagation,
      includeDefaultDependencies: true,
      omitProperties: [
        "TransitGatewayAttachmentId",
        "TransitGatewayRouteTableId",
        "ResourceId",
        "ResourceType",
        "State",
      ],
      inferName: inferNameRouteTableArm({ prefix: "tgw-rtb-propagation" }),
      compare: compareAws({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      dependencies: {
        transitGatewayRouteTable: {
          type: "TransitGatewayRouteTable",
          group: "EC2",
          parent: true,
        },
        ...transitGatewayAttachmentDependencies,
        // TODO add other attachment type
      },
    },
    {
      type: "VpnGateway",
      Client: EC2VpnGateway,
      omitProperties: ["VpnGatewayId", "State", "VpcAttachments"],
      propertiesDefault: { Type: "ipsec.1" },
      compare: compareEC2({ filterAll: () => pick([]) }),
      ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
    },
    {
      type: "VpnConnection",
      Client: EC2VpnConnection,
      ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
      omitProperties: [
        "CustomerGatewayId",
        "VpnGatewayId",
        "TransitGatewayId",
        "CoreNetworkArn",
        "State",
        "VpnConnectionId",
        "GatewayAssociationState",
        "VgwTelemetry",
        "Options.TunnelOptions",
        "CustomerGatewayConfiguration",
        "Routes",
      ],
      propertiesDefault: {
        Type: "ipsec.1",
        Options: {
          EnableAcceleration: false,
          LocalIpv4NetworkCidr: "0.0.0.0/0",
          OutsideIpAddressType: "PublicIpv4",
          RemoteIpv4NetworkCidr: "0.0.0.0/0",
          StaticRoutesOnly: false,
          TunnelInsideIpVersion: "ipv4",
        },
      },
      dependencies: {
        customerGateway: { type: "CustomerGateway", group: "EC2" },
        vpnGateway: { type: "VpnGateway", group: "EC2" },
        transitGateway: { type: "TransitGateway", group: "EC2" },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareEC2({}), isOurMinion })),
]);
