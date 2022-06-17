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
const { cidrSubnetV6, cidrSubnetV4 } = require("@grucloud/core/ipUtils");

const {
  cidrsToNewBits,
  cidrsToNetworkNumber,
} = require("@grucloud/core/ipUtils");

const {
  findNameInTagsOrId,
  findNamespaceInTags,
  buildTags,
  destroyNetworkInterfaces,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createEC2,
  tagResource,
  untagResource,
  findDependenciesVpc,
} = require("./EC2Common");

const SubnetAttributes = [
  "MapPublicIpOnLaunch",
  "CustomerOwnedIpv4Pool",
  "MapCustomerOwnedIpOnLaunch",
  "MapPublicIpOnLaunch",
  "AssignIpv6AddressOnCreation",
  "EnableDns64"
];

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

exports.filterLiveSubnetV4 = ({ lives, providerConfig }) =>
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

exports.filterLiveSubnetV6 = when(
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

exports.EC2Subnet = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const isDefault = get("live.DefaultForAz");
  const cannotBeDeleted = isDefault;
  const managedByOther = isDefault;

  const findId = get("live.SubnetId");
  const pickId = pick(["SubnetId"]);

  const findName = pipe([
    fork({
      vpcName: ({ live, lives, config }) =>
        pipe([
          () =>
            lives.getById({
              id: live.VpcId,
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("name"),
          tap((name) => {
            assert(name, "no vpc name in subnet");
          }),
        ])(),
      subnetName: switchCase([
        get("live.DefaultForAz"),
        pipe([
          get("live.AvailabilityZone", ""),
          last,
          prepend("subnet-default-"),
        ]),
        findNameInTagsOrId({ findId }),
      ]),
    }),
    ({ vpcName, subnetName }) => `${vpcName}::${subnetName}`,
  ]);

  const findDependencies = ({ live }) => [findDependenciesVpc({ live })];

  const getList = client.getList({
    method: "describeSubnets",
    getParam: "Subnets",
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
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
  });

  const modifySubnetAttribute = ({ SubnetId }) =>
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
              ec2().modifySubnetAttribute,
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property
  const create = client.create({
    method: "createSubnet",
    filterPayload: omit(SubnetAttributes),
    pickCreated: () => get("Subnet"),
    pickId,
    getById,
    postCreate:
      ({ payload }) =>
      ({ SubnetId }) =>
        pipe([
          tap(() => {
            assert(SubnetId);
          }),
          () => payload,
          pick(SubnetAttributes),
          filter(identity),
          modifySubnetAttribute({ SubnetId }),
        ])(),
    config,
  });

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update subnet: ${name}`);
        //logger.debug(tos({ payload, diff }));
      }),
      () => diff.liveDiff.updated,
      modifySubnetAttribute({ SubnetId: live.SubnetId }),
      tap(() => {
        logger.info(`updated subnet ${name}`);
      }),
    ])();

  const destroy = client.destroy({
    pickId,
    preDestroy: ({ live: { SubnetId } }) =>
      destroyNetworkInterfaces({ ec2, Name: "subnet-id", Values: [SubnetId] }),
    method: "deleteSubnet",
    getById,
    ignoreErrorCodes: ["InvalidSubnetID.NotFound"],
  });

  const configDefault = async ({
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
            tap((params) => {
              assert(true);
            }),
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
                tap((params) => {
                  assert(true);
                }),
              ])
            ),
          ]),
        })
      ),
    ])();

  return {
    spec,
    isDefault,
    cannotBeDeleted,
    managedByOther,
    findId,
    findName,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    getList,
    create,
    update,
    destroy,
    configDefault,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
