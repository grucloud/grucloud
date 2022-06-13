const assert = require("assert");
const { pipe, tap, get, pick, eq, map, filter, not, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const { findDependenciesTransitGateway } = require("./EC2TransitGatewayCommon");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayVpcAttachments-property
  // TODO
  getById: {
    method: "describeTransitGatewayVpcAttachments",
    getField: "TransitGatewayVpcAttachments",
    pickId: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
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
  },
});

const findNameInDependency = ({ live, lives, config }) =>
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
        (id) =>
          lives.getById({
            id,
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
        (id) =>
          lives.getById({
            id,
            type: "Vpc",
            group: "EC2",
            providerName: config.providerName,
          }),
        get("name", live.VpcId),
      ]),
    }),
    ({ tgwName, vpcName }) => `tgw-vpc-attach::${tgwName}::${vpcName}`,
  ])();

const findId = pipe([
  get("live.TransitGatewayAttachmentId"),
  tap((TransitGatewayAttachmentId) => {
    assert(TransitGatewayAttachmentId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayVpcAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live, lives }) => [
      findDependenciesTransitGateway({ live, lives, config }),
      {
        type: "Vpc",
        group: "EC2",
        ids: [live.VpcId],
      },
      {
        type: "Subnet",
        group: "EC2",
        ids: live.SubnetIds,
      },
    ],
    findName: findNameInTagsOrId({ findId: findNameInDependency }),
    pickId: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
      ({ TransitGatewayAttachmentId }) => ({
        TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
      }),
    ]),

    findId,
    cannotBeDeleted: eq(get("live.State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { transitGateway, vpc, subnets },
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
