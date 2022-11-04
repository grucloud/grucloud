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
  flatMap,
} = require("rubico");
const {
  pluck,
  includes,
  first,
  size,
  unless,
  isEmpty,
  find,
  last,
  append,
  prepend,
  defaultsDeep,
  when,
  isDeepEqual,
  callProp,
  identity,
  flatten,
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
  replaceAccountAndRegion,
  findEksCluster,
} = require("../AwsCommon");
const { findInStatement } = require("../IAM/AwsIamCommon");

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
  addIcmpPorts,
} = require("./AwsSecurityGroupRule");
const { AwsElasticIpAddress } = require("./AwsElasticIpAddress");
const {
  EC2ElasticIpAddressAssociation,
} = require("./EC2ElasticIpAddressAssociation");
const { EC2FlowLogs, FlowLogsDependencies } = require("./EC2FlowLogs");
const { AwsVolume, setupEbsVolume } = require("./AwsVolume");
const { EC2CustomerGateway } = require("./EC2CustomerGateway");
const { EC2ClientVpnEndpoint } = require("./EC2ClientVpnEndpoint");
const { EC2ClientVpnTargetNetwork } = require("./EC2ClientVpnTargetNetwork");
const {
  EC2ClientVpnAuthorizationRule,
} = require("./EC2ClientVpnAuthorizationRule");

const { EC2ManagedPrefixList } = require("./EC2ManagedPrefixList");
const { EC2VolumeAttachment } = require("./EC2VolumeAttachment");
const { EC2NetworkInterface } = require("./AwsNetworkInterface");
const { EC2NetworkAcl } = require("./EC2NetworkAcl");
const { EC2VpcPeeringConnection } = require("./EC2VpcPeeringConnection");
const { EC2PlacementGroup } = require("./EC2PlacementGroup");
const {
  EC2VpcPeeringConnectionAccepter,
} = require("./EC2VpcPeeringConnectionAccepter");
const { EC2TransitGateway } = require("./EC2TransitGateway");
const {
  EC2TransitGatewayAttachment,
} = require("./EC2TransitGatewayAttachment");
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
const { EC2VpnGatewayAttachment } = require("./EC2VpnGatewayAttachment");
const {
  EC2VpnGatewayRoutePropagation,
} = require("./EC2VpnGatewayRoutePropagation");
const { EC2VpnConnection } = require("./EC2VpnConnection");
const { EC2VpnConnectionRoute } = require("./EC2VpnConnectionRoute");

const GROUP = "EC2";

const getResourceNameFromTag = () =>
  pipe([get("Tags"), find(eq(get("Key"), "Name")), get("Value")]);

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
      omit(["GroupId", "GroupName", "UserIdGroupPairs", "PrefixListIds"]),
      omitPort({ port: "FromPort" }),
      omitPort({ port: "ToPort" }),
    ]),
]);

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
    dependencyId: ({ lives, config }) => get("GroupId"),
  },
  securityGroupFrom: {
    type: "SecurityGroup",
    group: "EC2",
    list: true,
    dependencyIds:
      ({ lives, config }) =>
      (live) =>
        pipe([() => live, get("UserIdGroupPairs", []), pluck("GroupId")])(),
  },
  prefixLists: {
    type: "ManagedPrefixList",
    group: "EC2",
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([get("PrefixListIds"), pluck("PrefixListId")]),
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
        pipe([() => properties({}), addIcmpPorts, omit(["UserIdGroupPairs"])])()
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
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            IpAddress: ({ IpAddress }) =>
              pipe([
                () => lives,
                fork({
                  ipAddressAzure: pipe([
                    find(
                      and([
                        eq(get("groupType"), "Network::PublicIPAddress"),
                        eq(get("live.properties.ipAddress"), IpAddress),
                      ])
                    ),
                    get("id"),
                  ]),
                  ipAddressGoogle: pipe([
                    find(
                      and([
                        eq(get("groupType"), "compute::Address"),
                        eq(get("live.address"), IpAddress),
                      ])
                    ),
                    get("id"),
                  ]),
                }),
                switchCase([
                  get("ipAddressAzure"),
                  pipe([
                    get("ipAddressAzure"),
                    replaceWithName({
                      groupType: "Network::PublicIPAddress",
                      pathLive: "id",
                      path: "live.properties.ipAddress",
                      providerConfig,
                      lives,
                    }),
                  ]),
                  get("ipAddressGoogle"),
                  pipe([
                    get("ipAddressGoogle"),
                    replaceWithName({
                      groupType: "compute::Address",
                      pathLive: "id",
                      path: "live.address",
                      providerConfig,
                      lives,
                    }),
                  ]),
                  () => IpAddress,
                ]),
              ])(),
          }),
        ]),
      dependencies: {
        certificate: {
          type: "Certificate",
          group: "ACM",
          dependencyId: ({ lives, config }) => get("CertificateArn"),
        },
        ipAddressAzure: {
          type: "PublicIPAddress",
          group: "Network",
          providerType: "azure",
          dependencyId:
            ({ lives, config }) =>
            ({ IpAddress }) =>
              pipe([
                tap((params) => {
                  assert(IpAddress);
                }),
                () =>
                  lives.getByType({
                    providerType: "azure",
                    type: "PublicIPAddress",
                    group: "Network",
                  }),
                find(eq(get("live.properties.ipAddress"), IpAddress)),
                get("id"),
              ])(),
        },
        ipAddressGoogle: {
          type: "Address",
          group: "compute",
          providerType: "google",
          dependencyId:
            ({ lives, config }) =>
            ({ IpAddress }) =>
              pipe([
                tap((params) => {
                  assert(IpAddress);
                }),
                () =>
                  lives.getByType({
                    providerType: "google",
                    type: "Address",
                    group: "compute",
                  }),
                find(eq(get("live.address"), IpAddress)),
                get("id"),
              ])(),
        },
        virtualNetworkGatewayAzure: {
          type: "VirtualNetworkGateway",
          group: "Network",
          providerType: "azure",
          dependencyId:
            ({ lives, config }) =>
            ({ IpAddress }) =>
              pipe([
                () =>
                  lives.getByType({
                    providerType: "azure",
                    type: "VirtualNetworkGateway",
                    group: "Network",
                  }),
                find(
                  pipe([
                    get("live.properties.bgpSettings.bgpPeeringAddresses"),
                    pluck("tunnelIpAddresses"),
                    flatten,
                    any(includes(IpAddress)),
                  ])
                ),
                get("id"),
              ])(),
        },
      },
    },
    {
      type: "ClientVpnAuthorizationRule",
      Client: EC2ClientVpnAuthorizationRule,
      omitProperties: ["ClientVpnEndpointId", "Status"],
      inferName: pipe([
        ({
          properties: { TargetNetworkCidr },
          dependenciesSpec: { clientVpnEndpoint },
        }) =>
          `client-vpn-rule-assoc::${clientVpnEndpoint}::${TargetNetworkCidr}`,
      ]),
      propertiesDefault: {},
      compare: compareEC2({ filterAll: () => pick([]) }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omitIfEmpty(["GroupId"]),
        ]),
      dependencies: {
        clientVpnEndpoint: {
          type: "ClientVpnEndpoint",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("ClientVpnEndpointId"),
        },
      },
    },
    {
      type: "ClientVpnEndpoint",
      Client: EC2ClientVpnEndpoint,
      omitProperties: [
        "ClientVpnEndpointId",
        "CreationTime",
        "ServerCertificateArn",
        "DnsName",
        "SecurityGroupIds",
        "VpcId",
        "Status",
        "ClientConnectOptions.Status",
        "AuthenticationOptions[].MutualAuthentication.ClientRootCertificateChain",
        "SelfServicePortalUrl",
        "ConnectionLogOptions.CloudwatchLogGroup",
        "ConnectionLogOptions.CloudwatchLogStream",
      ],
      ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
      propertiesDefault: {
        VpnPort: 443,
        SessionTimeoutHours: 24,
        ClientLoginBannerOptions: { Enabled: false },
        ConnectionLogOptions: {
          Enabled: false,
        },
        ClientConnectOptions: {
          Enabled: false,
        },
        SplitTunnel: false,
        VpnProtocol: "openvpn",
        TransportProtocol: "udp",
      },
      compare: compareEC2({ filterAll: () => pick([]) }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omitIfEmpty(["Description"]),
          assign({
            AuthenticationOptions: pipe([
              get("AuthenticationOptions"),
              map(
                pipe([
                  switchCase([
                    eq(get("Type"), "certificate-authentication"),
                    pipe([
                      assign({
                        MutualAuthentication: pipe([
                          get("MutualAuthentication"),
                          assign({
                            ClientRootCertificateChainArn: pipe([
                              get("ClientRootCertificateChain"),
                              tap((params) => {
                                assert(true);
                              }),
                              replaceWithName({
                                groupType: "ACM::Certificate",
                                path: "id",
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ]),
                      }),
                    ]),
                    identity,
                  ]),
                ])
              ),
            ]),
          }),
        ]),
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          excludeDefaultDependencies: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
        },
        cloudWatchLogGroup: {
          type: "LogGroup",
          group: "CloudWatchLogs",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("ConnectionLogOptions.CloudwatchLogGroup"),
              (name) =>
                lives.getByName({
                  name,
                  providerName: config.providerName,
                  type: "LogGroup",
                  group: "CloudWatchLogs",
                }),
              get("id"),
            ]),
        },
        // cloudWatchLogStream: {
        //   type: "LogStream",
        //   group: "CloudWatchLogs",
        //   dependencyId: ({ lives, config }) =>
        //     pipe([
        //       get("ConnectionLogOptions.CloudwatchLogStream"),
        //       (logStream) =>
        //         pipe([
        //           () =>
        //             lives.getByType({
        //               providerName: config.providerName,
        //               type: "LogStream",
        //               group: "CloudWatchLogs",
        //             }),
        //           find(pipe([eq(get("live.logStreamName"), logStream)])),
        //           get("id"),
        //         ])(),
        //     ]),
        // },
        serverCertificate: {
          type: "Certificate",
          group: "ACM",
          dependencyId: ({ lives, config }) => get("ServerCertificateArn"),
        },
        clientCertificate: {
          type: "Certificate",
          group: "ACM",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("AuthenticationOptions"),
              find(get("MutualAuthentication.ClientRootCertificateChain")),
              get("MutualAuthentication.ClientRootCertificateChain"),
            ]),
        },
      },
    },
    {
      type: "ClientVpnTargetNetwork",
      Client: EC2ClientVpnTargetNetwork,
      omitProperties: [
        "ClientVpnEndpointId",
        "AssociationId",
        "SubnetId",
        "VpcId",
        "Status",
        "SecurityGroups",
      ],
      inferName: pipe([
        get("dependenciesSpec"),
        ({ clientVpnEndpoint, subnet }) =>
          `client-vpn-target-assoc::${clientVpnEndpoint}::${subnet}`,
        tap((params) => {
          assert(true);
        }),
      ]),
      propertiesDefault: {},
      compare: compareEC2({ filterAll: () => pick([]) }),
      dependencies: {
        clientVpnEndpoint: {
          type: "ClientVpnEndpoint",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("ClientVpnEndpointId"),
        },
        subnet: {
          type: "Subnet",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("SubnetId"),
        },
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
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        dhcpOptions: {
          type: "DhcpOptions",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("DhcpOptionsId"),
        },
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
        "DeliverLogsStatus",
        "DeliverLogsErrorMessage",
        "LogGroupName",
        "FlowLogId",
        "FlowLogStatus",
        "LogDestinationType",
        "LogDestination",
      ],
      dependencies: {
        ...FlowLogsDependencies,
        iamRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("DeliverLogsPermissionArn"),
        },
        cloudWatchLogGroup: {
          type: "LogGroup",
          group: "CloudWatchLogs",
        },
        firehoseDeliveryStream: {
          type: "DeliveryStream",
          group: "Firehose",
        },
        s3Bucket: {
          type: "Bucket",
          group: "S3",
        },
      },
      compare: compareEC2({
        filterTarget: () => pipe([omit(["ResourceIds", "ResourceType"])]),
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          switchCase([
            ({ DeliverLogsPermissionArn }) =>
              pipe([
                () => lives,
                find(eq(get("id"), DeliverLogsPermissionArn)),
              ])(),
            omit(["DeliverLogsPermissionArn"]),
            when(
              get("DeliverLogsPermissionArn"),
              assign({
                DeliverLogsPermissionArn: pipe([
                  get("DeliverLogsPermissionArn"),
                  replaceAccountAndRegion({ providerConfig, lives }),
                ]),
              })
            ),
          ]),
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
        ipam: {
          type: "Ipam",
          group: "EC2",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "Ipam",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                find(eq(get("live.IpamArn"), live.IpamArn)),
                get("id"),
              ])(),
        },
      },
    },
    {
      type: "IpamPool",
      Client: EC2IpamPool,
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
        ipamPoolSource: {
          type: "IpamPool",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("SourceIpamPoolId"),
        },
        ipamScope: {
          type: "IpamScope",
          group: "EC2",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "IpamScope",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                find(eq(get("live.IpamScopeArn"), live.IpamScopeArn)),
                get("id"),
                tap((id) => {
                  assert(id);
                }),
              ])(),
        },
      },
    },
    {
      type: "IpamPoolCidr",
      Client: EC2IpamPoolCidr,
      omitProperties: ["IpamPoolId", "State", "FailureReason"],
      inferName: pipe([get("properties.Cidr")]),
      dependencies: {
        ipamPool: {
          type: "IpamPool",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("IpamPoolId"),
        },
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
        instance: {
          type: "Instance",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("Attachment.InstanceId"),
              (id) =>
                lives.getById({
                  providerName: config.providerName,
                  type: "Instance",
                  group: "EC2",
                  id,
                }),
              get("id"),
              tap((params) => {
                assert(true);
              }),
            ]),
        },
      },
    },
    {
      type: "Volume",
      Client: AwsVolume,
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
        volume: {
          type: "Volume",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VolumeId"),
        },
        instance: {
          type: "Instance",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("InstanceId"),
        },
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
        "VpcArn",
        "Ipv4IpamPoolId",
      ],
      dependencies: {
        ipamPoolIpv4: {
          type: "IpamPool",
          group: "EC2",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "IpamPool",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                find(
                  and([
                    eq(get("live.AddressFamily"), "ipv4"),
                    pipe([
                      get("live.Allocations"),
                      find(eq(get("ResourceId"), live.VpcId)),
                    ]),
                  ])
                ),
                get("live.IpamPoolId"),
              ])(),
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
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        internetGateway: {
          type: "InternetGateway",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("InternetGatewayId"),
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
        vpc: {
          type: "Vpc",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([get("Attachments"), first, get("VpcId")]),
        },
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
        subnet: {
          type: "Subnet",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("SubnetId"),
        },
        eip: {
          type: "ElasticIpAddress",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("NatGatewayAddresses"),
              pluck("AllocationId"),
              map((AllocationId) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "ElasticIpAddress",
                      group: "EC2",
                      providerName: config.providerName,
                    }),
                  find(eq(get("live.AllocationId"), AllocationId)),
                  get("id"),
                ])()
              ),
              first,
            ]),
        },
      },
      //TODO remove ?
      ignoreResource: () => get("isDefault"),
    },
    {
      type: "Subnet",
      Client: EC2Subnet,
      getResourceName: () =>
        pipe([
          switchCase([
            get("DefaultForAz"),
            pipe([
              get("AvailabilityZone", ""),
              last,
              prepend("subnet-default-"),
            ]),
            getResourceNameFromTag(),
          ]),
        ]),
      inferName: ({ resourceName, properties, dependenciesSpec }) =>
        pipe([
          tap((params) => {
            assert(dependenciesSpec.vpc);
            assert(resourceName);
          }),
          () => resourceName,
          callProp("split", "::"),
          last,
          prepend("::"),
          prepend(dependenciesSpec.vpc),
        ])(),
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
        vpc: {
          type: "Vpc",
          group: "EC2",
          //TODO
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
      },
    },
    {
      type: "RouteTable",
      Client: EC2RouteTable,
      getResourceName: () =>
        pipe([
          switchCase([
            pipe([get("Associations"), any(get("Main"))]),
            pipe([() => "rt-default"]),
            getResourceNameFromTag(),
          ]),
        ]),
      inferName: ({ resourceName, properties, dependenciesSpec }) =>
        pipe([
          tap((params) => {
            assert(dependenciesSpec.vpc);
            assert(resourceName);
          }),
          () => resourceName,
          callProp("split", "::"),
          last,
          prepend("::"),
          prepend(dependenciesSpec.vpc),
        ])(),
      omitProperties: [
        "VpcId",
        "Associations",
        "PropagatingVgws",
        "RouteTableId",
        "OwnerId",
        "Routes",
      ],
      findDefault: findDefaultWithVpcDependency,
      filterLive: () => pick([]),
      // ignoreResource: (input) =>
      //   pipe([
      //     and([
      //       get("managedByOther"),
      //       pipe([
      //         get("usedBy"),
      //         filter(not(get("managedByOther"))),
      //         tap((params) => {
      //           assert(true);
      //         }),
      //         isEmpty,
      //       ]),
      //     ]),
      //   ]),
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
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
      dependencies: {
        routeTable: {
          type: "RouteTable",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("RouteTableId"),
        },
        subnet: {
          type: "Subnet",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("SubnetId"),
        },
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
          pipe([
            omit([
              "Origin",
              "State",
              "DestinationPrefixListId",
              "InstanceOwnerId",
            ]),
            when(get("InstanceId"), omit(["NetworkInterfaceId"])),
          ]),
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
          coreNetwork,
          ec2Instance,
          egressOnlyInternetGateway,
          ig,
          natGateway,
          prefixList,
          transitGateway,
          routeTable,
          vpcEndpoint,
          vpcPeeringConnection,
          vpnGateway,
        },
      }) =>
        pipe([
          tap(() => {
            assert(routeTable);
          }),
          () => routeTable,
          switchCase([
            () => coreNetwork,
            pipe([append("::core")]),
            () => ig,
            pipe([append("::igw")]),
            () => natGateway,
            pipe([append("::nat-gateway")]),
            () => vpcEndpoint,
            pipe([append(`::${vpcEndpoint}`)]),
            () => transitGateway,
            pipe([append(`::tgw`)]),
            () => egressOnlyInternetGateway,
            pipe([append(`::eogw`)]),
            () => ec2Instance,
            pipe([append(`::${ec2Instance}`)]),
            () => vpcPeeringConnection,
            pipe([append(`::pcx`)]),
            () => vpnGateway,
            pipe([append(`::vgw`)]),
            pipe([append("::local")]),
          ]),
          switchCase([
            () => prefixList,
            append(`::${prefixList}`),
            appendCidrSuffix(properties),
          ]),
        ])(),
      dependencies: {
        coreNetwork: {
          type: "CoreNetwork",
          group: "NetworkManager",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("CoreNetworkArn"),
        },
        ec2Instance: {
          type: "Instance",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("InstanceId"),
        },
        egressOnlyInternetGateway: {
          type: "EgressOnlyInternetGateway",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            get("EgressOnlyInternetGatewayId"),
        },
        ig: {
          type: "InternetGateway",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) =>
                lives.getById({
                  id: live.GatewayId,
                  type: "InternetGateway",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        natGateway: {
          type: "NatGateway",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("NatGatewayId"),
        },
        prefixList: {
          type: "ManagedPrefixList",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              unless(
                pipe([get("GatewayId", ""), callProp("startsWith", "vpce-")]),
                get("DestinationPrefixListId")
              ),
            ]),
        },
        routeTable: {
          type: "RouteTable",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("RouteTableId"),
        },
        transitGateway: {
          type: "TransitGateway",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("TransitGatewayId"),
        },
        vpcEndpoint: {
          type: "VpcEndpoint",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) =>
                lives.getById({
                  id: live.GatewayId,
                  type: "VpcEndpoint",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        vpcPeeringConnection: {
          type: "VpcPeeringConnection",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("VpcPeeringConnectionId"),
        },
        vpnGateway: {
          type: "VpnGateway",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) =>
                lives.getById({
                  id: live.GatewayId,
                  type: "VpnGateway",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
      },
    },
    {
      type: "SecurityGroup",
      Client: AwsSecurityGroup,
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
      inferName: ({ resourceName, properties, dependenciesSpec: { vpc } }) =>
        pipe([
          () => resourceName,
          when(
            isEmpty,
            pipe([
              () => "sg::",
              when(() => vpc, append(`${vpc}::`)),
              switchCase([
                () => properties.GroupName,
                append(properties.GroupName),
                append("default"),
              ]),
            ])
          ),
        ])(),
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        eksCluster: {
          type: "Cluster",
          group: "EKS",
          ignoreOnDestroy: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) => ({ live, lives }),
              findEksCluster({ config }),
              get("id"),
            ]),
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
      dependencies: securityGroupRuleDependencies,
      inferName: inferNameSecurityGroupRule({ kind: "ingress" }),
    },
    {
      type: "SecurityGroupRuleEgress",
      Client: AwsSecurityGroupRuleEgress,
      compare: compareSecurityGroupRule,
      filterLive: securityGroupRulePickProperties,
      dependencies: securityGroupRuleDependencies,
      inferName: inferNameSecurityGroupRule({ kind: "egress" }),
    },
    {
      type: "ElasticIpAddress",
      // TODO
      // dependencies: {
      //   internetGateway: {
      //     type: "InternetGateway",
      //     group: "EC2",
      //     dependencyId: ({ lives, config }) => get(""),
      //   },
      // },
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
        eip: {
          type: "ElasticIpAddress",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("AllocationId"),
        },
        instance: {
          type: "Instance",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("InstanceId"),
        },
      },
      omitProperties: ["InstanceId", "AllocationId", "AssociationId"],
      inferName: ({ properties, dependenciesSpec: { eip, instance } }) =>
        pipe([
          tap(() => {
            assert(eip);
          }),
          () => `eip-attach::${eip}`,
          when(() => instance, append(`::${instance}`)),
        ])(),
    },
    {
      type: "Instance",
      Client: EC2Instance,
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html#runInstances-property
      propertiesDefault: {
        DisableApiStop: false,
        DisableApiTermination: false,
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
        "StateReason",
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
        subnets: {
          type: "Subnet",
          group: "EC2",
          //TODO no list
          list: true,
          dependencyId: ({ lives, config }) => get("SubnetId"),
        },
        keyPair: {
          type: "KeyPair",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("KeyName"),
              (name) =>
                lives.getByName({
                  name,
                  type: "KeyPair",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        iamInstanceProfile: {
          type: "InstanceProfile",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("IamInstanceProfile.Arn"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("SecurityGroups"), pluck("GroupId")]),
        },
        launchTemplate: {
          type: "LaunchTemplate",
          group: "EC2",
          dependencyId: ({ lives, config }) => getLaunchTemplateIdFromTags,
        },
        placementGroup: {
          type: "PlacementGroup",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("Placement.GroupName"),
              (name) =>
                pipe([
                  () =>
                    lives.getByName({
                      name,
                      type: "PlacementGroup",
                      group: "EC2",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])(),
            ]),
        },
      },
    },
    {
      type: "LaunchTemplate",
      Client: EC2LaunchTemplate,
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
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("LaunchTemplateData.NetworkInterfaces", []),
              pluck("SubnetId"),
            ]),
        },
        keyPair: {
          type: "KeyPair",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("LaunchTemplateData.KeyName"),
              (KeyName) =>
                lives.getByName({
                  name: KeyName,
                  type: "KeyPair",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        iamInstanceProfile: {
          type: "InstanceProfile",
          group: "IAM",
          dependencyIds:
            ({ lives, config }) =>
            (live) =>
              [
                pipe([
                  () => live,
                  get("LaunchTemplateData.IamInstanceProfile.Arn"),
                ])(),
                pipe([
                  () => live,
                  get("LaunchTemplateData.IamInstanceProfile.Name"),
                  (name) =>
                    lives.getByName({
                      name,
                      type: "InstanceProfile",
                      group: "IAM",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])(),
              ],
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              fork({
                fromMain: get("LaunchTemplateData.SecurityGroupIds"),
                fromInterfaces: pipe([
                  get("LaunchTemplateData.NetworkInterfaces"),
                  pluck("Groups"),
                  flatten,
                ]),
              }),
              ({ fromMain = [], fromInterfaces = [] }) => [
                ...fromMain,
                ...fromInterfaces,
              ],
            ]),
        },
        placementGroup: {
          type: "PlacementGroup",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("LaunchTemplateData.Placement.GroupName"),
              (name) =>
                pipe([
                  () =>
                    lives.getByName({
                      name,
                      type: "PlacementGroup",
                      group: "EC2",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])(),
            ]),
        },
      },
    },
    {
      type: "NetworkAcl",
      Client: EC2NetworkAcl,
      listOnly: true,
      ignoreResource: () => pipe([() => true]),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2", dependencyId: () => get("VpcId") },
        subnets: {
          type: "Subnet",
          group: "EC2",
          excludeDefaultDependencies: true,
          dependencyIds: () => pipe([get("Associations"), pluck("SubnetId")]),
        },
      },
    },
    {
      type: "ManagedPrefixList",
      dependencies: {},
      Client: EC2ManagedPrefixList,
      inferName: get("properties.PrefixListName"),
      compare: compareEC2({
        filterAll: () => pipe([pick(["Entries", "MaxEntries"])]),
      }),
      omitProperties: [
        "PrefixListId",
        "State",
        "PrefixListArn",
        "Version",
        "OwnerId",
      ],
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          pick(["PrefixListName", "AddressFamily", "MaxEntries", "Entries"]),
          assign({
            PrefixListName: pipe([
              get("PrefixListName"),
              replaceRegion({ providerConfig }),
            ]),
          }),
        ]),
    },
    {
      type: "PlacementGroup",
      dependencies: {},
      Client: EC2PlacementGroup,
      omitProperties: ["State", "GroupId", "GroupArn", "PartitionCount"],
      inferName: pipe([get("properties.GroupName")]),
    },
    {
      type: "VpcEndpoint",
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          //TODO
          parentForName: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        // Interface endpoint
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          parent: true,
          //TODO
          parentForName: true,
          dependencyIds: ({ lives, config }) => get("SubnetIds"),
        },
        // Gateway endpoint
        routeTables: {
          type: "RouteTable",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("RouteTableIds"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Groups"), pluck("GroupId")]),
        },
        // NetworkInterfaceIds ?
        firewall: {
          type: "Firewall",
          group: "NetworkFirewall",
          parent: true,
          //TODO
          parentForName: true,
          ignoreOnDestroy: true,
          dependencyId: ({ lives, config }) =>
            pipe([get("Tags"), find(eq(get("Key"), "Firewall")), get("Value")]),
        },
        iamRoles: {
          type: "Role",
          group: "IAM",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("PolicyDocument.Statement", []),
              flatMap(
                findInStatement({ type: "Role", group: "IAM", lives, config })
              ),
              pluck("id"),
            ]),
        },
      },
      Client: EC2VpcEndpoint,
      shortName: true,
      getResourceName: getResourceNameFromTag,
      inferName: ({ resourceName, properties, dependenciesSpec }) =>
        pipe([
          tap((params) => {
            assert(dependenciesSpec.vpc);
          }),
          () => "",
          switchCase([
            () => dependenciesSpec.firewall,
            pipe([
              append("vpce::"),
              append(dependenciesSpec.firewall),
              append("::"),
              append(pipe([() => dependenciesSpec.subnets, first])()),
            ]),
            pipe([
              append(dependenciesSpec.vpc),
              append("::"),
              append(resourceName || properties.ServiceName),
            ]),
          ]),
        ])(),
      omitProperties: [
        "VpcEndpointId",
        "VpcId",
        "State",
        "RouteTableIds",
        "SubnetIds",
        "Groups",
        "SecurityGroupIds",
        "NetworkInterfaceIds",
        "DnsEntries",
        "CreationTimestamp",
        "OwnerId",
      ],
      propertiesDefault: {
        PrivateDnsEnabled: false,
        RequesterManaged: false,
      },
      compare: compareEC2({
        filterAll: () =>
          pipe([
            when(
              eq(get("VpcEndpointType"), "Interface"),
              defaultsDeep({
                IpAddressType: "ipv4",
                DnsOptions: { DnsRecordIpType: "ipv4" },
              })
            ),
            differenceObject({
              PolicyDocument: {
                Version: "2008-10-17",
                Statement: [
                  {
                    Action: "*",
                    Effect: "Allow",
                    Principal: "*",
                    Resource: "*",
                  },
                ],
              },
            }),
          ]),
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          when(
            eq(get("VpcEndpointType"), "Interface"),
            differenceObject({
              IpAddressType: "ipv4",
              DnsOptions: { DnsRecordIpType: "ipv4" },
            })
          ),
          differenceObject({
            PolicyDocument: {
              Version: "2008-10-17",
              Statement: [
                {
                  Action: "*",
                  Effect: "Allow",
                  Principal: "*",
                  Resource: "*",
                },
              ],
            },
          }),
          assign({
            ServiceName: pipe([
              get("ServiceName"),
              replaceRegion({ providerConfig }),
            ]),
          }),
          when(
            get("PolicyDocument"),
            assignPolicyDocumentAccountAndRegion({ providerConfig, lives })
          ),
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
          dependencyId: ({ lives, config }) => get("RequesterVpcInfo.VpcId"),
        },
        vpcPeer: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("AccepterVpcInfo.VpcId"),
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
          dependencyId: ({ lives, config }) => get("VpcPeeringConnectionId"),
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
        transitGateway: {
          type: "TransitGateway",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("TransitGatewayId"),
        },
      },
    },
    {
      type: "TransitGatewayPeeringAttachment",
      Client: EC2TransitGatewayPeeringAttachment,
      inferName: pipe([
        get("dependenciesSpec"),
        tap(({ transitGateway, transitGatewayPeer }) => {
          assert(transitGateway);
          assert(transitGatewayPeer);
        }),
        ({ transitGateway, transitGatewayPeer }) =>
          `tgw-peering-attach::${transitGateway}::${transitGatewayPeer}`,
      ]),
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
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            get("RequesterTgwInfo.TransitGatewayId"),
        },
        transitGatewayPeer: {
          type: "TransitGateway",
          group: "EC2",
          parent: true,
          parentForName: true,
          dependencyId: ({ lives, config }) =>
            get("AccepterTgwInfo.TransitGatewayId"),
        },
      },
      filterLive: ({ providerConfig }) =>
        pipe([
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
      type: "TransitGatewayAttachment",
      Client: EC2TransitGatewayAttachment,
      // TODO remove this
      //ignoreResource: () => true,
      omitProperties: [
        "TransitGatewayOwnerId",
        "ResourceOwnerId",
        "ResourceId",
        "Association",
        "TransitGatewayAttachmentId",
        "TransitGatewayId",
        "CreationTime",
        "State",
      ],
      dependencies: {
        transitGateway: {
          type: "TransitGateway",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("TransitGatewayId"),
        },
        //TODO do we need vpc ?
        vpc: {
          type: "Vpc",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("ResourceId"),
        },
        vpnConnection: {
          type: "VpnConnection",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("ResourceId"),
        },
      },
    },
    {
      type: "TransitGatewayVpcAttachment",
      Client: EC2TransitGatewayVpcAttachment,
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
          dependencyId: ({ lives, config }) => get("TransitGatewayId"),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SubnetIds"),
        },
        //TODO remove ?
        // transitGatewayRouteTables: {
        //   type: "TransitGatewayRouteTable",
        //   group: "EC2",
        //   list: true,
        // },
      },
    },
    {
      type: "TransitGatewayRouteTableAssociation",
      Client: EC2TransitGatewayRouteTableAssociation,
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
          dependencyId: ({ lives, config }) =>
            get("TransitGatewayRouteTableId"),
        },
        ...transitGatewayAttachmentDependencies,
      },
    },
    {
      type: "TransitGatewayRouteTablePropagation",
      Client: EC2TransitGatewayRouteTablePropagation,
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
          dependencyId: ({ lives, config }) =>
            get("TransitGatewayRouteTableId"),
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
      type: "VpnGatewayAttachment",
      Client: EC2VpnGatewayAttachment,
      ignoreResource: () => pipe([get("live"), eq(get("State"), "detached")]),
      omitProperties: ["VpnGatewayId", "VpcId", "State"],
      compare: compareEC2({ filterAll: () => pick([]) }),
      inferName: ({ dependenciesSpec: { vpc, vpnGateway } }) =>
        `vpn-gw-attach::${vpnGateway}::${vpc}`,
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        vpnGateway: {
          type: "VpnGateway",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VpnGatewayId"),
        },
      },
    },
    {
      type: "VpnGatewayRoutePropagation",
      Client: EC2VpnGatewayRoutePropagation,
      omitProperties: ["GatewayId", "RouteTableId", "State"],
      compare: compareEC2({ filterAll: () => pick([]) }),
      inferName: ({ dependenciesSpec: { routeTable, vpnGateway } }) =>
        `vpn-gw-rt::${vpnGateway}::${routeTable}`,
      dependencies: {
        routeTable: {
          type: "RouteTable",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("RouteTableId"),
        },
        vpnGateway: {
          type: "VpnGateway",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("GatewayId"),
        },
      },
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
      //filterLive Sort by PSK
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
        customerGateway: {
          type: "CustomerGateway",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("CustomerGatewayId"),
        },
        vpnGateway: {
          type: "VpnGateway",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("VpnGatewayId"),
        },
        transitGateway: {
          type: "TransitGateway",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("TransitGatewayId"),
        },
      },
    },
    {
      type: "VpnConnectionRoute",
      Client: EC2VpnConnectionRoute,
      inferName: ({
        properties: { DestinationCidrBlock },
        dependenciesSpec: { vpnConnection },
      }) => `vpn-conn-route::${vpnConnection}::${DestinationCidrBlock}`,
      omitProperties: ["VpnConnectionId", "State"],
      dependencies: {
        vpnConnection: {
          type: "VpnConnection",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VpnConnectionId"),
        },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareEC2({}), isOurMinion })),
]);
