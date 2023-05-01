const assert = require("assert");
const { pipe, tap, get, filter, map, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { isAwsError, compareAws } = require("../AwsCommon");
const {
  findDependenciesTgwAttachment,
  findNameRouteTableArm,
  inferNameRouteTableArm,
  transitGatewayAttachmentDependencies,
} = require("./EC2TransitGatewayCommon");

const pickId = pipe([
  tap(({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) => {
    assert(TransitGatewayRouteTableId);
    assert(TransitGatewayAttachmentId);
  }),
  pick(["TransitGatewayAttachmentId", "TransitGatewayRouteTableId"]),
]);

const findId = () =>
  pipe([
    tap(({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) => {
      assert(TransitGatewayRouteTableId);
      assert(TransitGatewayAttachmentId);
    }),
    ({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) =>
      `${TransitGatewayAttachmentId}::${TransitGatewayRouteTableId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRouteTableAssociation = ({ compare }) => ({
  type: "TransitGatewayRouteTableAssociation",
  package: "ec2",
  client: "EC2",
  omitProperties: ["TransitGatewayAttachmentId", "TransitGatewayRouteTableId"],
  inferName: inferNameRouteTableArm({ prefix: "tgw-rtb-assoc" }),
  compare: compareAws({
    filterTarget: () => pipe([pick([])]),
    filterLive: () => pipe([pick([])]),
  }),
  dependencies: {
    transitGatewayRouteTable: {
      type: "TransitGatewayRouteTable",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("TransitGatewayRouteTableId"),
    },
    ...transitGatewayAttachmentDependencies,
  },
  findDependencies: ({ live, lives, config }) => [
    {
      type: "TransitGatewayRouteTable",
      group: "EC2",
      ids: [live.TransitGatewayRouteTableId],
    },
    findDependenciesTgwAttachment({ live, lives, config }),
  ],
  findName: findNameRouteTableArm({
    prefix: "tgw-rtb-assoc",
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

  ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateTransitGatewayRouteTable-property
  create: {
    method: "associateTransitGatewayRouteTable",
    isExpectedException: isAwsError("Resource.AlreadyAssociated"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateTransitGatewayRouteTable-property
  destroy: { method: "disassociateTransitGatewayRouteTable", pickId },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: {
      transitGatewayRouteTable,
      transitGatewayVpcAttachment,
      transitGatewayVpnAttachment,
      transitGatewayAttachment,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(transitGatewayRouteTable);
        //TODO direct connect
        assert(
          transitGatewayVpcAttachment ||
            transitGatewayVpnAttachment ||
            transitGatewayAttachment
        );
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
        () => transitGatewayVpnAttachment,
        defaultsDeep({
          TransitGatewayAttachmentId: getField(
            transitGatewayVpnAttachment,
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
