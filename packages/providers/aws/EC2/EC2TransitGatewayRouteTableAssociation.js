const assert = require("assert");
const { pipe, tap, get, filter, map, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { isAwsError } = require("../AwsCommon");
const {
  findDependenciesTgwAttachment,
  findNameRouteTableArm,
} = require("./EC2TransitGatewayCommon");

const pickId = pipe([
  tap(({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) => {
    assert(TransitGatewayRouteTableId);
    assert(TransitGatewayAttachmentId);
  }),
  pick(["TransitGatewayAttachmentId", "TransitGatewayRouteTableId"]),
]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateTransitGatewayRouteTable-property
  create: {
    method: "associateTransitGatewayRouteTable",
    isExpectedException: isAwsError("Resource.AlreadyAssociated"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateTransitGatewayRouteTable-property
  destroy: { method: "disassociateTransitGatewayRouteTable", pickId },
});

const findId = pipe([
  get("live"),
  tap(({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) => {
    assert(TransitGatewayRouteTableId);
    assert(TransitGatewayAttachmentId);
  }),
  ({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) =>
    `${TransitGatewayAttachmentId}::${TransitGatewayRouteTableId}`,
  tap((params) => {
    assert(true);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRouteTableAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live, lives }) => [
      {
        type: "TransitGatewayRouteTable",
        group: "EC2",
        ids: [live.TransitGatewayRouteTableId],
      },
      findDependenciesTgwAttachment({ live, lives, config }),
    ],
    findName: findNameRouteTableArm({
      prefix: "tgw-rtb-assoc",
      config,
    }),

    findId,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayAttachments-property
    getList: ({ endpoint }) =>
      pipe([
        () => ({}),
        endpoint().describeTransitGatewayAttachments,
        get("TransitGatewayAttachments"),
        filter(get("Association")),
        map(
          ({
            Association: { TransitGatewayRouteTableId },
            TransitGatewayAttachmentId,
          }) => ({
            TransitGatewayAttachmentId,
            TransitGatewayRouteTableId,
          })
        ),
        tap((params) => {
          assert(true);
        }),
      ]),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties,
      dependencies: {
        transitGatewayRouteTable,
        transitGatewayVpcAttachment,
        transitGatewayAttachment,
      },
    }) =>
      pipe([
        tap((params) => {
          assert(transitGatewayRouteTable);
          //TODO direct connect
          assert(transitGatewayVpcAttachment || transitGatewayAttachment);
        }),
        () => properties,
        defaultsDeep({
          TransitGatewayRouteTableId: getField(
            transitGatewayRouteTable,
            "TransitGatewayRouteTableId"
          ),
        }),
        when(
          () => transitGatewayVpcAttachment,
          defaultsDeep({
            TransitGatewayAttachmentId: getField(
              transitGatewayVpcAttachment,
              "TransitGatewayAttachmentId"
            ),
          })
        ),
        when(
          () => transitGatewayAttachment,
          defaultsDeep({
            TransitGatewayAttachmentId: getField(
              transitGatewayAttachment,
              "TransitGatewayAttachmentId"
            ),
          })
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
