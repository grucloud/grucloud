const {
  get,
  pipe,
  map,
  tap,
  eq,
  not,
  pick,
  tryCatch,
  assign,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  find,
  size,
  first,
  callProp,
  when,
  unless,
  isEmpty,
} = require("rubico/x");
const assert = require("assert");

const { ipToInt32, ipDotFromInt32 } = require("@grucloud/core/ipUtils");
const logger = require("@grucloud/core/logger")({ prefix: "AwsNatGateway" });
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { findNameInTagsOrId, buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const { tagResource, untagResource, compareEC2 } = require("./EC2Common");

const findId = () => get("NatGatewayId");
const pickId = pick(["NatGatewayId"]);
const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const getBaseIpFromCidr = pipe([callProp("split", "/"), first]);

const indexOfIpAddress =
  (cidrBlock = "") =>
  (ipAddress) =>
    pipe([
      tap(() => {
        assert(ipAddress);
        //assert(cidrBlock);
      }),
      () => cidrBlock,
      getBaseIpFromCidr,
      ipToInt32,
      (cidrBlockNumber) => ipToInt32(ipAddress) - cidrBlockNumber,
      tap((index) => {
        assert(index > 0, `${ipAddress} below ${cidrBlock}`);
      }),
    ])();

const ipFromIndex = ({ cidrBlock, index }) =>
  pipe([
    tap((params) => {
      assert(cidrBlock);
    }),
    () => cidrBlock,
    getBaseIpFromCidr,
    ipToInt32,
    (cidrBlockNumber) => cidrBlockNumber + index,
    ipDotFromInt32,
  ])();

const getPrivateIp = pipe([
  get("NatGatewayAddresses"),
  first,
  get("PrivateIp"),
]);

const decorate = ({ endpoint, lives, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(lives);
      assert(config);
    }),
    assign({
      SubnetCidrBlock: pipe([
        get("SubnetId"),
        tap((SubnetId) => {
          assert(SubnetId);
        }),
        lives.getById({
          providerName: config.providerName,
          type: "Subnet",
          group: "EC2",
        }),
        get("live.CidrBlock"),
        tap((CidrBlock) => {
          //assert(CidrBlock);
        }),
      ]),
    }),
    assign({
      PrivateIpAddressIndex: ({ NatGatewayAddresses, SubnetCidrBlock }) =>
        pipe([
          () => ({ NatGatewayAddresses }),
          getPrivateIp,
          unless(isEmpty, indexOfIpAddress(SubnetCidrBlock)),
        ])(),
    }),
  ]);

const disassociateAddress = ({ endpoint }) =>
  tap(
    pipe([
      tap((live) => {
        assert(live);
        assert(endpoint);
      }),
      get("NatGatewayAddresses"),
      tap((NatGatewayAddresses) => {
        logger.info(
          `destroy nat #NatGatewayAddresses ${size(NatGatewayAddresses)}`
        );
      }),
      map(
        pipe([
          ({ AllocationId }) => ({
            Filters: [
              {
                Name: "allocation-id",
                Values: [AllocationId],
              },
            ],
          }),
          endpoint().describeAddresses,
          get("Addresses"),
          map(
            tryCatch(
              pipe([pick(["AssociationId"]), endpoint().disassociateAddress]),
              // AuthFailure
              // You do not have permission to access the specified resource.
              (error, address) =>
                pipe([
                  tap(() => {
                    logger.info(`error disassociateAddress  ${tos(error)}`);
                  }),
                  () => ({ error, address }),
                ])()
            )
          ),
        ])
      ),
    ])
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html
exports.EC2NatGateway = () => ({
  type: "NatGateway",
  package: "ec2",
  client: "EC2",
  propertiesDefault: { ConnectivityType: "public" },
  omitProperties: [
    "CreateTime",
    "DeleteTime",
    "AllocationId",
    "NatGatewayAddresses",
    "NatGatewayId",
    "SubnetId",
    "State",
    "VpcId",
    "DeleteTime",
    "FailureCode",
    "FailureMessage",
    "SubnetCidrBlock",
  ],
  compare: compareEC2({ filterAll: () => pipe([pick([])]) }),
  dependencies: {
    subnet: {
      type: "Subnet",
      group: "EC2",
      parent: true,
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
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["NatGatewayNotFound"],
  getById: {
    method: "describeNatGateways",
    getField: "NatGateways",
    pickId: ({ NatGatewayId }) => ({ NatGatewayIds: [NatGatewayId] }),
    decorate,
  },
  getList: {
    method: "describeNatGateways",
    getParam: "NatGateways",
    filterResource: not(isInstanceDown),
    decorate,
  },
  create: {
    filterPayload: pipe([
      when(
        get("PrivateIpAddressIndex"),
        ({ PrivateIpAddressIndex, SubnetCidrBlock, ...other }) => ({
          PrivateIpAddress: ipFromIndex({
            cidrBlock: SubnetCidrBlock,
            index: PrivateIpAddressIndex,
          }),
          ...other,
        })
      ),
      omit(["SubnetCidrBlock"]),
    ]),
    method: "createNatGateway",
    pickCreated: () => get("NatGateway"),
    isInstanceUp: pipe([eq(get("State"), "available")]),
    isInstanceError: pipe([eq(get("State"), "failed")]),
    getErrorMessage: get("FailureMessage", "error"),
  },
  destroy: {
    preDestroy: disassociateAddress,
    method: "deleteNatGateway",
    pickId,
    isInstanceDown,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { eip, subnet },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(eip, "NatGateway is missing the dependency 'eip'");
        assert(subnet, "NatGateway is missing the dependency 'subnet'");
      }),
      () => otherProps,
      defaultsDeep({
        AllocationId: getField(eip, "AllocationId"),
        SubnetId: getField(subnet, "SubnetId"),
        SubnetCidrBlock: getField(subnet, "CidrBlock"),
        TagSpecifications: [
          {
            ResourceType: "natgateway",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
