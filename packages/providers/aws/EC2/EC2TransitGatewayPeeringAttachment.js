const assert = require("assert");
const { pipe, tap, get, pick, eq, map, filter, not } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayPeeringAttachments-property
  getById: {
    method: "describeTransitGatewayPeeringAttachments",
    getField: "TransitGatewayPeeringAttachments",
    pickId: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
      ({ TransitGatewayAttachmentId }) => ({
        TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayPeeringAttachments-property
  getList: {
    method: "describeTransitGatewayPeeringAttachments",
    getParam: "TransitGatewayPeeringAttachments",
    transformListPre: pipe([filter(not(isInstanceDown))]),
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTransitGatewayPeeringAttachment-property
  create: {
    method: "createTransitGatewayPeeringAttachment",
    pickCreated: ({ payload }) =>
      pipe([get("TransitGatewayPeeringAttachment")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTransitGatewayPeeringAttachment-property
  destroy: {
    method: "deleteTransitGatewayPeeringAttachment",
    pickId: pipe([
      tap(({ TransitGatewayAttachmentId }) => {
        assert(TransitGatewayAttachmentId);
      }),
      pick(["TransitGatewayAttachmentId"]),
    ]),
    isInstanceDown,
  },
});

const findId = pipe([
  get("live.TransitGatewayAttachmentId"),
  tap((TransitGatewayAttachmentId) => {
    assert(TransitGatewayAttachmentId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayPeeringAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live }) => [
      {
        type: "TransitGateway",
        group: "EC2",
        ids: [
          live.RequesterTgwInfo.TransitGatewayId,
          live.AccepterTgwInfo.TransitGatewayId,
        ],
      },
    ],
    findName: findNameInTagsOrId({ findId }),
    findId,
    cannotBeDeleted: eq(get("live.State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { transitGateway, transitGatewayPeer },
    }) =>
      pipe([
        tap((params) => {
          assert(transitGateway);
          assert(transitGatewayPeer);
        }),
        () => otherProps,
        defaultsDeep({
          TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
          PeerTransitGatewayId: getField(
            transitGatewayPeer,
            "TransitGatewayId"
          ),
          TagSpecifications: [
            {
              ResourceType: "transit-gateway-attachment",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
