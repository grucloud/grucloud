const assert = require("assert");
const { pipe, tap, get, pick, map, fork, switchCase } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { isAwsError } = require("../AwsCommon");

const {
  findDependenciesTgwAttachment,
  findNameRouteTableArm,
} = require("./EC2TransitGatewayCommon");

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-transitgatewayroutetablepropagation.html

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
});

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
exports.EC2TransitGatewayRouteTablePropagation = ({ spec, config }) =>
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
      prefix: "tgw-rtb-propagation",
    }),
    findId,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getTransitGatewayRouteTablePropagations-property
    getList: ({ client }) =>
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
