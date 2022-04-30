const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
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
    method: "describeTransitGatewayAttachments",
    getField: "TransitGatewayAttachments",
  },
  getList: {
    method: "describeTransitGatewayAttachments",
    getParam: "TransitGatewayAttachments",
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
        type: "TransitGatewayRouteTable",
        group: "EC2",
        ids: [get("Association.TransitGatewayRouteTableId")(live)],
      },
      {
        type: "Vpc",
        group: "EC2",
        ids: [live.ResourceId],
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
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { transitGatewayRouteTable, vpc },
    }) =>
      pipe([
        tap((params) => {
          assert(transitGatewayRouteTable);
          assert(vpc);
        }),
        () => otherProps,
        defaultsDeep({
          TansitGatewayRouteTableId: getField(
            transitGatewayRouteTable,
            "TansitGatewayRouteTableId"
          ),
          VpcId: getField(vpc, "VpcId"),
          TagSpecifications: [
            {
              ResourceType: "transit-gateway-attachment",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
