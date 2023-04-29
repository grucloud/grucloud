const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { isAwsError, compareAws } = require("../AwsCommon");

const {
  findDependenciesTgwAttachment,
  findNameRouteTableArm,
  inferNameRouteTableArm,
  transitGatewayAttachmentDependencies,
} = require("./EC2TransitGatewayCommon");

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetablepropagation.html

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
      `${TransitGatewayRouteTableId}::${TransitGatewayAttachmentId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRouteTablePropagation = ({ compare }) => ({
  type: "TransitGatewayRouteTablePropagation",
  package: "ec2",
  client: "EC2",
  inferName: inferNameRouteTableArm({ prefix: "tgw-rtb-propagation" }),
  findName: findNameRouteTableArm({
    prefix: "tgw-rtb-propagation",
  }),
  findId,
  findDependencies: ({ live, lives, config }) => [
    {
      type: "TransitGatewayRouteTable",
      group: "EC2",
      ids: [live.TransitGatewayRouteTableId],
    },
    findDependenciesTgwAttachment({ live, lives, config }),
  ],
  omitProperties: [
    "TransitGatewayAttachmentId",
    "TransitGatewayRouteTableId",
    "ResourceId",
    "ResourceType",
    "State",
  ],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getTransitGatewayRouteTablePropagations-property
  getList: ({ client, config }) =>
    pipe([
      client.getListWithParent({
        parent: { type: "TransitGatewayRouteTable", group: "EC2" },
        pickKey: pipe([pick(["TransitGatewayRouteTableId"])]),
        method: "getTransitGatewayRouteTablePropagations",
        getParam: "TransitGatewayRouteTablePropagations",
        config,
        decorate: ({ lives, parent: { TransitGatewayRouteTableId } }) =>
          pipe([defaultsDeep({ TransitGatewayRouteTableId })]),
      }),
    ]),
  ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#enableTransitGatewayRouteTablePropagation-property
  create: {
    method: "enableTransitGatewayRouteTablePropagation",
    isExpectedException: isAwsError(
      "TransitGatewayRouteTablePropagation.Duplicate"
    ),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disableTransitGatewayRouteTablePropagation-property
  destroy: { method: "disableTransitGatewayRouteTablePropagation", pickId },
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
      }),
      () => properties,
      defaultsDeep({
        TransitGatewayRouteTableId: getField(
          transitGatewayRouteTable,
          "TransitGatewayRouteTableId"
        ),
      }),
      //TODO common with route and route table association
      switchCase([
        () => transitGatewayVpcAttachment,
        defaultsDeep({
          TransitGatewayAttachmentId: getField(
            transitGatewayVpcAttachment,
            "TransitGatewayAttachmentId"
          ),
        }),
        () => transitGatewayVpnAttachment,
        defaultsDeep({
          TransitGatewayAttachmentId: getField(
            transitGatewayVpnAttachment,
            "TransitGatewayAttachmentId"
          ),
        }),
        () => transitGatewayAttachment,
        defaultsDeep({
          TransitGatewayAttachmentId: getField(
            transitGatewayAttachment,
            "TransitGatewayAttachmentId"
          ),
        }),
        //TODO other attachment type
        () => {
          assert(false, "missing attachment dependency");
        },
      ]),
      tap((params) => {
        assert(true);
      }),
    ])(),
});
