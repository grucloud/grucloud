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
} = require("@grucloud/core/Common");
const {
  compareAws,
  isOurMinion,
  assignPolicyDocumentAccountAndRegion,
  replaceRegion,
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
const { appendCidrSuffix } = require("./EC2Common");
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
const { AwsSubnet } = require("./AwsSubnet");
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

const { EC2TransitGateway } = require("./EC2TransitGateway");
const {
  EC2TransitGatewayVpcAttachment,
} = require("./EC2TransitGatewayVpcAttachment");

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
      tap((params) => {
        assert(true);
      }),
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

const assingIpamRegion = ({ providerConfig }) =>
  assign({
    IpamRegion: pipe([get("IpamRegion"), replaceRegion({ providerConfig })]),
  });

const omitLocaleNone = when(eq(get("Locale"), "None"), omit(["Locale"]));

const getLaunchTemplateIdFromTags = pipe([
  get("Tags"),
  find(eq(get("Key"), "aws:ec2launchtemplate:id")),
  get("Value"),
]);

const getByIdfromLives =
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
            getByIdfromLives({ lives, groupType: "EC2::Subnet" }),
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
                getByIdfromLives({ lives, groupType: "EC2::SecurityGroup" }),
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
      //TODO infername
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
        "LogGroupName",
        "FlowLogId",
        "FlowLogStatus",
        "LogDestinationType",
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
      filterLive: () =>
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
                  tap((params) => {
                    assert(true);
                  }),
                  (LogDestination) => ({ Id: LogDestination, lives }),
                  replaceWithName({
                    groupType: "S3::Bucket",
                    path: "id",
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
        pipe([assingIpamRegion({ providerConfig })]),
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
          assingIpamRegion({ providerConfig }),
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
      ],
      compare: compareEC2({
        filterLive: () => pipe([omitLocaleNone]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([assingIpamRegion({ providerConfig }), omitLocaleNone]),
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
      ],
      propertiesDefault: { DnsSupport: true, DnsHostnames: false },
      compare: compareEC2({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["AmazonProvidedIpv6CidrBlock"]),
          ]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
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
      Client: AwsSubnet,
      includeDefaultDependencies: true,
      omitProperties: [
        "VpcId",
        "AvailabilityZoneId",
        "AvailableIpAddressCount",
        "DefaultForAz",
        "State",
        "SubnetId",
        "OwnerId",
        "AssignIpv6AddressOnCreation",
        "Ipv6CidrBlockAssociationSet",
        "SubnetArn",
      ],
      propertiesDefault: {
        MapPublicIpOnLaunch: false,
        MapCustomerOwnedIpOnLaunch: false,
        EnableDns64: false,
        Ipv6Native: false,
        PrivateDnsNameOptionsOnLaunch: {
          HostnameType: "ip-name",
          EnableResourceNameDnsARecord: false,
          EnableResourceNameDnsAAAARecord: false,
        },
      },
      filterLive: () =>
        pipe([
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
        ig: { type: "InternetGateway", group: "EC2" },
        natGateway: { type: "NatGateway", group: "EC2" },
        vpcEndpoint: { type: "VpcEndpoint", group: "EC2" },
        transitGateway: { type: "TransitGateway", group: "EC2" },
        egressOnlyInternetGateway: {
          type: "EgressOnlyInternetGateway",
          group: "EC2",
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
        ({ lives }) =>
        (live) =>
          pipe([
            () => live,
            differenceObject(
              pipe([
                () => live,
                getLaunchTemplateIdFromTags,
                getByIdfromLives({ lives, groupType: "EC2::LaunchTemplate" }),
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
                  getByIdfromLives({ lives, groupType: "EC2::LaunchTemplate" }),
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
                          map(({ GroupId }) =>
                            pipe([
                              () => ({ Id: GroupId, lives }),
                              replaceWithName({
                                groupType: "EC2::SecurityGroup",
                                path: "id",
                              }),
                            ])()
                          ),
                        ]),
                        SubnetId: ({ SubnetId }) =>
                          pipe([
                            () => ({ Id: SubnetId, lives }),
                            replaceWithName({
                              groupType: "EC2::Subnet",
                              path: "id",
                            }),
                          ])(),
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
                      (Id) => ({ Id, lives }),
                      replaceWithName({
                        groupType: "EC2::LaunchTemplate",
                        path: "id",
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
      filterLive: ({ lives }) =>
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
                            map((GroupId) =>
                              pipe([
                                () => ({ Id: GroupId, lives }),
                                replaceWithName({
                                  groupType: "EC2::SecurityGroup",
                                  path: "id",
                                }),
                              ])()
                            ),
                          ]),
                          SubnetId: ({ SubnetId }) =>
                            pipe([
                              () => ({ Id: SubnetId, lives }),
                              replaceWithName({
                                groupType: "EC2::Subnet",
                                path: "id",
                              }),
                            ])(),
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
      propertiesDefault: {},
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
      propertiesDefault: {},
      dependencies: {
        transitGatewayRouteTable: {
          type: "TransitGatewayRouteTable",
          group: "EC2",
          parent: true,
        },
        transitGatewayVpcAttachment: {
          type: "TransitGatewayVpcAttachment",
          group: "EC2",
          parent: true,
        },
      },
      inferName: ({
        properties: { DestinationCidrBlock },
        dependenciesSpec: {
          transitGatewayVpcAttachment,
          transitGatewayRouteTable,
        },
      }) =>
        pipe([
          tap(() => {
            assert(transitGatewayVpcAttachment);
            assert(transitGatewayRouteTable);
          }),
          () =>
            `tgw-route::${transitGatewayVpcAttachment}::${transitGatewayRouteTable}::${DestinationCidrBlock}`,
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
      propertiesDefault: {},
      dependencies: {
        transitGateway: { type: "TransitGateway", group: "EC2" },
      },
    },
    {
      type: "TransitGatewayVpcAttachment",
      Client: EC2TransitGatewayVpcAttachment,
      includeDefaultDependencies: true,
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
      propertiesDefault: {},
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
      inferName: ({
        dependenciesSpec: {
          transitGatewayVpcAttachment,
          transitGatewayRouteTable,
        },
      }) =>
        pipe([
          tap(() => {
            assert(transitGatewayVpcAttachment);
            assert(transitGatewayRouteTable);
          }),
          () =>
            `tgw-rtb-assoc::${transitGatewayVpcAttachment}::${transitGatewayRouteTable}`,
        ])(),
      compare: compareAws({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      dependencies: {
        transitGatewayVpcAttachment: {
          type: "TransitGatewayVpcAttachment",
          group: "EC2",
          parent: true,
        },
        transitGatewayRouteTable: {
          type: "TransitGatewayRouteTable",
          group: "EC2",
          parent: true,
        },
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
      inferName: ({
        dependenciesSpec: {
          transitGatewayRouteTable,
          transitGatewayVpcAttachment,
          //TODO other attachment type
        },
      }) =>
        pipe([
          tap(() => {
            assert(transitGatewayRouteTable);
            assert(transitGatewayVpcAttachment);
          }),
          () =>
            `tgw-rtb-propagation::${transitGatewayRouteTable}::${transitGatewayVpcAttachment}`,
        ])(),
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
        transitGatewayVpcAttachment: {
          type: "TransitGatewayVpcAttachment",
          group: "EC2",
          parent: true,
        },
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
      propertiesDefault: { Type: "ipsec.1" },
      dependencies: {
        customerGateway: { type: "CustomerGateway", group: "EC2" },
        vpnGateway: { type: "VpnGateway", group: "EC2" },
        transitGateway: { type: "TransitGateway", group: "EC2" },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareEC2({}), isOurMinion })),
]);
