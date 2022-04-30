const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  getById: {
    method: "describeTransitGatewayVpcAttachments",
    getField: "TransitGatewayVpcAttachments",
  },
  getList: {
    method: "describeTransitGatewayVpcAttachments",
    getParam: "TransitGatewayVpcAttachments",
  },
  create: { method: "createTransitGatewayVpcAttachment" },
  destroy: { method: "deleteTransitGatewayVpcAttachment" },
});

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
    findDependencies: ({ live }) => [
      {
        type: "TransitGateway",
        group: "EC2",
        ids: [
          `arn:aws:ec2:${config.region}:${config.accountId()}:transit-gateway/${
            live.TransitGatewayId
          }`,
        ],
      },
      // {
      //   type: "Vpc",
      //   group: "EC2",
      //   ids: [live.VpcId],
      // },
      {
        type: "Subnet",
        group: "EC2",
        ids: live.SubnetIds,
      },
    ],
    findName: findNameInTagsOrId({ findId }),
    pickId: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
      ({ TransitGatewayAttachmentId }) => ({
        TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
      }),
    ]),
    pickIdDestroy: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
      pick(["TransitGatewayAttachmentId"]),
    ]),
    findId,
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),

    pickCreated: ({ payload }) => pipe([get("TransitGatewayAttachment")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
    cannotBeDeleted: eq(get("live.State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { transitGateway, subnets },
    }) =>
      pipe([
        tap((params) => {
          assert(transitGateway);
          assert(subnets);
        }),
        () => otherProps,
        defaultsDeep({
          TransitGatewayId: getField(transitGateway, "TansitGatewayId"),
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
