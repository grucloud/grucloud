const assert = require("assert");
const { pipe, tap, get, pick, eq, map, filter, not, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);
const isInstanceError = pipe([eq(get("State"), "failed")]);

const findNameInDependency =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => live,
      fork({
        tgwName: pipe([
          get("TransitGatewayId"),
          tap((TransitGatewayId) => {
            assert(TransitGatewayId);
          }),
          lives.getById({
            type: "TransitGateway",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", live.TransitGatewayId),
        ]),
        vpcName: pipe([
          get("VpcId"),
          tap((VpcId) => {
            assert(VpcId);
          }),
          lives.getById({
            type: "Vpc",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", live.VpcId),
        ]),
      }),
      ({ tgwName, vpcName }) => `tgw-vpc-attach::${tgwName}::${vpcName}`,
    ])();

const findId = () =>
  pipe([
    get("TransitGatewayAttachmentId"),
    tap((TransitGatewayAttachmentId) => {
      assert(TransitGatewayAttachmentId);
    }),
  ]);

const pickId = pipe([
  tap(({ TransitGatewayAttachmentId }) => {
    assert(TransitGatewayAttachmentId);
  }),
  ({ TransitGatewayAttachmentId }) => ({
    TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayVpcAttachment = ({ compare }) => ({
  type: "TransitGatewayVpcAttachment",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  findName: findNameInTagsOrId({ findId: findNameInDependency }),
  pickId,
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
  findId,
  cannotBeDeleted: () => eq(get("State"), "deleted"),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayVpcAttachments-property
  // TODO
  getById: {
    method: "describeTransitGatewayVpcAttachments",
    getField: "TransitGatewayVpcAttachments",
    pickId: pipe([
      ({ TransitGatewayAttachmentId }) => ({
        TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
      }),
    ]),
  },
  getList: {
    method: "describeTransitGatewayVpcAttachments",
    getParam: "TransitGatewayVpcAttachments",
    transformListPre: () => pipe([filter(not(isInstanceDown))]),
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),
  },
  create: {
    method: "createTransitGatewayVpcAttachment",
    pickCreated: ({ payload }) => pipe([get("TransitGatewayVpcAttachment")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  destroy: {
    method: "deleteTransitGatewayVpcAttachment",
    pickId: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
      pick(["TransitGatewayAttachmentId"]),
    ]),
    isInstanceDown,
    isInstanceError,
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { transitGateway, vpc, subnets },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(transitGateway);
        assert(vpc);
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
        VpcId: getField(vpc, "VpcId"),
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ])(),
        TagSpecifications: [
          {
            ResourceType: "transit-gateway-attachment",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
