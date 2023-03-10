const assert = require("assert");
const {
  get,
  switchCase,
  pipe,
  tap,
  map,
  tryCatch,
  any,
  eq,
  omit,
  pick,
  filter,
  assign,
  fork,
  and,
} = require("rubico");
const {
  callProp,
  defaultsDeep,
  last,
  identity,
  prepend,
  first,
  when,
  unless,
  isEmpty,
  find,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EC2Subnet" });

const { getField } = require("@grucloud/core/ProviderCommon");
const { tos } = require("@grucloud/core/tos");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  cidrSubnetV6,
  cidrSubnetV4,
  cidrsToNewBits,
  cidrsToNetworkNumber,
} = require("@grucloud/core/ipUtils");

const {
  findNameInTagsOrId,
  buildTags,
  destroyNetworkInterfaces,
  arnFromId,
} = require("../AwsCommon");

const {
  tagResource,
  untagResource,
  getResourceNameFromTag,
  buildAvailabilityZone,
} = require("./EC2Common");

const SubnetAttributes = [
  "MapPublicIpOnLaunch",
  "CustomerOwnedIpv4Pool",
  "MapCustomerOwnedIpOnLaunch",
  "MapPublicIpOnLaunch",
  "AssignIpv6AddressOnCreation",
  "EnableDns64",
];

const isDefault = () => get("DefaultForAz");
const cannotBeDeleted = isDefault;
const managedByOther = isDefault;

const findId = () => get("SubnetId");
const pickId = pick(["SubnetId"]);

const findName = ({ lives, config }) =>
  pipe([
    fork({
      vpcName: (live) =>
        pipe([
          () => live,
          get("VpcId"),
          lives.getById({
            type: "Vpc",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", live.VpcId),
          tap((name) => {
            assert(name, "no vpc name in subnet");
          }),
        ])(),
      subnetName: switchCase([
        get("DefaultForAz"),
        pipe([get("AvailabilityZone", ""), last, prepend("subnet-default-")]),
        findNameInTagsOrId({ findId })({ lives, config }),
      ]),
    }),
    ({ vpcName, subnetName }) => `${vpcName}::${subnetName}`,
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Arn: pipe([
        get("SubnetId"),
        prepend("subnet/"),
        arnFromId({ service: "ec2", config }),
      ]),
    }),
  ]);

const omitAssignIpv6AddressOnCreationIfIpv6Native = when(
  get("Ipv6Native"),
  omit(["AssignIpv6AddressOnCreation"])
);

exports.omitAssignIpv6AddressOnCreationIfIpv6Native =
  omitAssignIpv6AddressOnCreationIfIpv6Native;

const getFirstIpv6CidrBlock = pipe([
  get("Ipv6CidrBlockAssociationSet"),
  first,
  get("Ipv6CidrBlock"),
]);

const filterLiveSubnetV4 = ({ lives, providerConfig }) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(providerConfig);
    }),
    when(get("CidrBlock"), (live) =>
      pipe([
        () => lives,
        find(eq(get("id"), live.VpcId)),
        get("live.CidrBlock"),
        (vpcCidr) =>
          pipe([
            () => live,
            assign({
              NewBits: () =>
                cidrsToNewBits({ vpcCidr, subnetCidr: live.CidrBlock }),
              NetworkNumber: () =>
                cidrsToNetworkNumber({ vpcCidr, subnetCidr: live.CidrBlock }),
            }),
            omit(["CidrBlock"]),
          ])(),
      ])()
    ),
  ]);

const filterLiveSubnetV6 = when(
  getFirstIpv6CidrBlock,
  assign({
    Ipv6SubnetPrefix: pipe([
      getFirstIpv6CidrBlock,
      tap((params) => {
        assert(true);
      }),
      callProp("split", "/"),
      first,
      callProp("replaceAll", "::", ""),
      callProp("slice", -2),
      tap((params) => {
        assert(true);
      }),
    ]),
  })
);

const extractSubnetName = pipe([callProp("split", "::"), last]);

const modifySubnetAttribute = ({ endpoint, SubnetId }) =>
  pipe([
    tap((params) => {
      assert(SubnetId);
    }),
    map.entries(
      tryCatch(
        ([key, Value]) =>
          pipe([
            () => ({ [key]: { Value }, SubnetId }),
            tap((params) => {
              logger.debug(`modifySubnetAttribute ${JSON.stringify(params)}`);
            }),
            endpoint().modifySubnetAttribute,
            () => [key, Value],
          ])(),
        (error, [key]) =>
          pipe([
            tap(() => {
              logger.error(
                `modifySubnetAttribute ${JSON.stringify({
                  error,
                  key,
                })}`
              );
            }),
            () => [key, { error: { error } }],
          ])()
      )
    ),
    tap((params) => {
      assert(true);
    }),
    tap.if(any(get("error")), (results) => {
      throw Error(`modifySubnetAttribute error: ${tos(results)}`);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkSubnet.html
exports.EC2Subnet = ({ compare }) => ({
  type: "Subnet",
  package: "ec2",
  client: "EC2",
  findName,
  findId,
  ignoreErrorCodes: ["InvalidSubnetID.NotFound"],
  dependencies: {},
  cannotBeDeleted,
  managedByOther,
  isDefault,
  getResourceName: () =>
    pipe([
      switchCase([
        get("DefaultForAz"),
        pipe([get("AvailabilityZone", ""), last, prepend("subnet-default-")]),
        get("Tags"),
        getResourceNameFromTag(),
        get("SubnetId"),
      ]),
    ]),
  inferName:
    ({ resourceName, dependenciesSpec: { vpc } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(vpc);
          assert(resourceName);
        }),
        () => resourceName,
        callProp("split", "::"),
        last,
        prepend("::"),
        prepend(vpc),
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
    "Arn",
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
  compare: compare({
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
  getById: {
    pickId: ({ SubnetId }) => ({
      Filters: [
        {
          Name: "subnet-id",
          Values: [SubnetId],
        },
      ],
    }),
    method: "describeSubnets",
    getField: "Subnets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
  getList: {
    method: "describeSubnets",
    getParam: "Subnets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property
  create: {
    method: "createSubnet",
    filterPayload: omit(SubnetAttributes),
    pickCreated: () => get("Subnet"),
    pickId,
    postCreate:
      ({ endpoint, payload }) =>
      ({ SubnetId }) =>
        pipe([
          () => payload,
          pick(SubnetAttributes),
          filter(identity),
          modifySubnetAttribute({ endpoint, SubnetId }),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        tap(() => {
          logger.info(`update subnet: ${name}`);
          //logger.debug(tos({ payload, diff }));
        }),
        () => diff.liveDiff.updated,
        modifySubnetAttribute({ endpoint, SubnetId: live.SubnetId }),
        tap(() => {
          logger.info(`updated subnet ${name}`);
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteSubnet-property
  destroy: {
    pickId,
    preDestroy: ({ endpoint }) =>
      tap(({ SubnetId }) =>
        pipe([
          tap((params) => {
            assert(SubnetId);
          }),
          () => ({
            Name: "subnet-id",
            Values: [SubnetId],
          }),
          destroyNetworkInterfaces({ endpoint }),
        ])()
      ),
    method: "deleteSubnet",
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: {
      Tags,
      NewBits,
      NetworkNumber,
      Ipv6SubnetPrefix,
      ...otherProps
    },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "subnet",
            Tags: buildTags({
              config,
              namespace,
              name: extractSubnetName(name),
              UserTags: Tags,
            }),
          },
        ],
      }),
      when(
        () => NewBits && vpc.live,
        assign({
          CidrBlock: () =>
            cidrSubnetV4({
              cidr: vpc.live.CidrBlock,
              newBits: NewBits,
              networkNumber: NetworkNumber,
            }),
        })
      ),
      omitAssignIpv6AddressOnCreationIfIpv6Native,
      when(
        () => Ipv6SubnetPrefix,
        assign({
          Ipv6CidrBlock: pipe([
            () => vpc,
            get("live.Ipv6CidrBlockAssociationSet"),
            unless(
              isEmpty,
              pipe([
                first,
                get("Ipv6CidrBlock"),
                cidrSubnetV6({
                  subnetPrefix: Ipv6SubnetPrefix,
                  prefixLength: "64",
                }),
              ])
            ),
          ]),
        })
      ),
    ])(),
});
