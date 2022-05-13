const assert = require("assert");
const { pipe, tap, get, pick, map, fork, switchCase } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { isAwsError } = require("../AwsCommon");

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

const findId = pipe([
  get("live"),
  tap(({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) => {
    assert(TransitGatewayRouteTableId);
    assert(TransitGatewayAttachmentId);
  }),
  ({ TransitGatewayRouteTableId, TransitGatewayAttachmentId }) =>
    `${TransitGatewayRouteTableId}::${TransitGatewayAttachmentId}`,
  tap((params) => {
    assert(true);
  }),
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
      {
        type: "TransitGatewayVpcAttachment",
        group: "EC2",
        ids: [
          pipe([
            () =>
              lives.getById({
                id: live.TransitGatewayAttachmentId,
                type: "TransitGatewayVpcAttachment",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("id"),
          ])(),
        ],
      },
    ],
    findName: ({ live, lives }) =>
      pipe([
        tap((params) => {
          assert(live.TransitGatewayAttachmentId);
          assert(live.TransitGatewayRouteTableId);
        }),
        fork({
          //TODO add other attachment type
          // transitGatewayXXXAttachment: pipe([
          //   () =>
          //     lives.getById({
          //       id: live.TransitGatewayAttachmentId,
          //       type: "TransitGatewayXXXAttachment",
          //       group: "EC2",
          //       providerName: config.providerName,
          //     }),
          //   get("name", ""),
          // ]),
          transitGatewayVpcAttachment: pipe([
            () =>
              lives.getById({
                id: live.TransitGatewayAttachmentId,
                type: "TransitGatewayVpcAttachment",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name", ""),
          ]),
          transitGatewayRouteTable: pipe([
            () =>
              lives.getById({
                id: live.TransitGatewayRouteTableId,
                type: "TransitGatewayRouteTable",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
        }),
        tap(
          ({
            transitGatewayRouteTable,
            transitGatewayVpcAttachment,
            transitGatewayXXXAttachment,
          }) => {
            assert(transitGatewayRouteTable);
            assert(transitGatewayVpcAttachment || transitGatewayXXXAttachment);
          }
        ),
        ({
          transitGatewayRouteTable,
          transitGatewayVpcAttachment = "",
          transitGatewayXXXAttachment,
        }) =>
          pipe([
            () => `tgw-rtb-propagation::${transitGatewayRouteTable}::`,
            switchCase([
              () => transitGatewayVpcAttachment,
              append(transitGatewayVpcAttachment),
              //TODO
              // () => transitGatewayXXXAttachment,
              // append(transitGatewayXXXAttachment),
              () => {
                assert(false, "missing attachment");
              },
            ]),
          ])(),
        tap((params) => {
          assert(true);
        }),
      ])(),
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
      dependencies: { transitGatewayRouteTable, transitGatewayVpcAttachment },
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
        switchCase([
          () => transitGatewayVpcAttachment,
          defaultsDeep({
            TransitGatewayAttachmentId: getField(
              transitGatewayVpcAttachment,
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
