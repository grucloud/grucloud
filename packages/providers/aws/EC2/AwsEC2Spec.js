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
  isEmpty,
  find,
  last,
  append,
  defaultsDeep,
  when,
  isDeepEqual,
  callProp,
} = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  compareAws,
  isOurMinion,
  DecodeUserData,
  assignPolicyDocumentAccountAndRegion,
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
  inferNameSecurityGroupRule,
} = require("./AwsSecurityGroupRule");
const { AwsElasticIpAddress } = require("./AwsElasticIpAddress");
const { AwsVolume, setupEbsVolume } = require("./AwsVolume");
const { EC2ManagedPrefixList } = require("./EC2ManagedPrefixList");

const { EC2VolumeAttachment } = require("./EC2VolumeAttachment");
const { AwsNetworkInterface } = require("./AwsNetworkInterface");
const { AwsNetworkAcl } = require("./AwsNetworkAcl");
const { AwsImage } = require("./AwsImage");
const { EC2VpcEndpoint } = require("./EC2VpcEndpoint");

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
  ({ type, targetResources }) =>
  ({ GroupName }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(targetResources);
        assert(GroupName);
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
  filter(
    pipe([
      assign({ IpRanges: pipe([get("IpRanges"), map(omit(["Description"]))]) }),
      (rule) =>
        !isDeepEqual(rule, {
          FromPort: undefined,
          IpProtocol: "-1",
          IpRanges: [{ CidrIp: "0.0.0.0/0" }],
          ToPort: undefined,
        }),
    ])
  ),
  sortByFromPort,
]);

module.exports = pipe([
  () => [
    {
      type: "KeyPair",
      Client: AwsClientKeyPair,
      propertiesDefault: { KeyType: "rsa" },
      omitProperties: ["KeyPairId", "KeyFingerprint"],
      filterLive: () => pick([]),
    },
    {
      type: "Image",
      Client: AwsImage,
      ignoreResource: () => () => true,
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
        "MultiAttachEnabled",
        "Device",
      ],
      setupEbsVolume,
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
      Client: AwsVpc,
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
      filterLive: () => pick(["CidrBlock", "DnsSupport", "DnsHostnames"]),
    },
    {
      type: "InternetGateway",
      Client: AwsInternetGateway,
      compare: compareEC2({
        filterLive: () =>
          pipe([omit(["Attachments", "InternetGatewayId", "OwnerId"])]),
      }),
      filterLive: () => pick([]),
      dependencies: { vpc: { type: "Vpc", group: "EC2" } },
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
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        internetGateway: { type: "InternetGateway", group: "EC2" },
      },
      //TODO remove ?
      ignoreResource: () => get("isDefault"),
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
          pipe([
            omit([
              "GatewayId",
              "NatGatewayId",
              "VpcEndpointId",
              "DestinationPrefixListId",
              "Origin",
              "State",
              "name",
              "RouteTableId",
            ]),
          ]),
      }),
      filterLive: () => pipe([pick(["DestinationCidrBlock"])]),
      inferName: ({
        properties,
        dependenciesSpec: { routeTable, ig, natGateway, vpcEndpoint },
      }) =>
        pipe([
          tap(() => {
            assert(routeTable);
          }),
          () =>
            pipe([
              tap(() => {
                assert(routeTable);
              }),
              () => routeTable,
              switchCase([
                () => ig,
                append("-igw"),
                () => natGateway,
                append("-nat-gateway"),
                () => vpcEndpoint,
                append("-vpce"),
                append("-local"),
              ]),
            ])(),
        ])(),
      includeDefaultDependencies: true,
      dependencies: {
        routeTable: { type: "RouteTable", group: "EC2", parent: true },
        ig: { type: "InternetGateway", group: "EC2" },
        natGateway: { type: "NatGateway", group: "EC2" },
        vpcEndpoint: { type: "VpcEndpoint", group: "EC2" },
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
            assign({
              IpPermissions: getIpPermissions({
                type: "SecurityGroupRuleIngress",
                targetResources,
              }),
              IpPermissionsEgress: getIpPermissions({
                type: "SecurityGroupRuleEgress",
                targetResources,
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
              ]),
            }),
          ]),
        filterAll: () => pipe([omit(["VpcId", "OwnerId", "GroupId"])]),
      }),
      filterLive: () => pick(["GroupName", "Description"]),
      inferName: ({ properties, dependenciesSpec: { vpc } }) =>
        pipe([
          tap(() => {
            assert(vpc);
          }),
          () => `sg::${vpc}::${properties.GroupName || "default"}`,
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
      type: "Instance",
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
          DecodeUserData,
        ]),
      dependencies: ec2InstanceDependencies,
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
      },
      //TODO double check
      ignoreResource: () =>
        pipe([
          get("live.ServiceName"),
          callProp("startsWith", "com.amazonaws.vpce"),
        ]),
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
          ]),
          assignPolicyDocumentAccountAndRegion({ providerConfig, lives }),
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareEC2({}), isOurMinion })),
]);
