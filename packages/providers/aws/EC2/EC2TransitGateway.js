const assert = require("assert");
const { pipe, tap, get, pick, eq, filter, not, or, map } = require("rubico");
const { defaultsDeep, isEmpty, first } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const deleteTransitGatewayPeeringAttachment = ({ endpoint }) =>
  pipe([
    tap(({ TransitGatewayId }) => {
      assert(TransitGatewayId);
    }),
    ({ TransitGatewayId }) => ({
      Filters: [
        {
          Name: "transit-gateway-id",
          Values: [TransitGatewayId],
        },
      ],
    }),
    endpoint().describeTransitGatewayPeeringAttachments,
    get("TransitGatewayPeeringAttachments"),
    map((livePeeringAttachment) =>
      pipe([
        () => livePeeringAttachment,
        pick(["TransitGatewayAttachmentId"]),
        endpoint().deleteTransitGatewayPeeringAttachment,
        () =>
          retryCall({
            name: `destroy EC2TransitGatewayPeeringAttachment`,
            fn: pipe([
              () => livePeeringAttachment,
              ({ TransitGatewayAttachmentId }) => ({
                TransitGatewayAttachmentIds: [TransitGatewayAttachmentId],
              }),
              endpoint().describeTransitGatewayPeeringAttachments,
              get("TransitGatewayPeeringAttachments"),
              first,
              or([isEmpty, eq(get("State"), "deleted")]),
            ]),
          }),
      ])()
    ),
  ])();

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayID.NotFound"],
  getById: { method: "describeTransitGateways", getField: "TransitGateways" },
  getList: {
    method: "describeTransitGateways",
    getParam: "TransitGateways",
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
    method: "createTransitGateway",
    isInstanceUp: pipe([eq(get("State"), "available")]),
    pickCreated: ({ payload }) => pipe([get("TransitGateway")]),
  },
  destroy: {
    method: "deleteTransitGateway",
    shouldRetryOnExceptionMessages: ["has non-deleted VPN Attachments"],
    isInstanceDown,
    pickId: pipe([
      tap(({ TransitGatewayId }) => {
        assert(TransitGatewayId);
      }),
      pick(["TransitGatewayId"]),
    ]),
    preDestroy: deleteTransitGatewayPeeringAttachment,
  },
});

const findId = () =>
  pipe([
    get("TransitGatewayId"),
    tap((TransitGatewayId) => {
      assert(TransitGatewayId);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGateway = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    pickId: pipe([
      tap(({ TransitGatewayId }) => {
        assert(TransitGatewayId);
      }),
      ({ TransitGatewayId }) => ({ TransitGatewayIds: [TransitGatewayId] }),
    ]),
    findId,
    cannotBeDeleted: () => eq(get("State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, IpAddress, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "transit-gateway",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
