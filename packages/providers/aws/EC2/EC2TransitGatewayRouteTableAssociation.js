const assert = require("assert");
const {
  pipe,
  tap,
  get,
  filter,
  map,
  fork,
  switchCase,
  tryCatch,
} = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { isAwsError } = require("../AwsCommon");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
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
    findDependencies: ({ live }) => [
      {
        type: "TransitGatewayRouteTable",
        group: "EC2",
        ids: [live.TransitGatewayRouteTableId],
      },
      {
        type: "TransitGatewayVpcAttachment",
        group: "EC2",
        ids: [live.TransitGatewayAttachmentId],
      },
    ],
    //TODO direct connect
    findName: ({ live, lives }) =>
      pipe([
        fork({
          transitGatewayVpcAttachment: pipe([
            () =>
              lives.getById({
                id: live.TransitGatewayAttachmentId,
                type: "TransitGatewayVpcAttachment",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
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
        tap(({ transitGatewayVpcAttachment, transitGatewayRouteTable }) => {
          assert(transitGatewayVpcAttachment);
          assert(transitGatewayRouteTable);
        }),
        ({ transitGatewayVpcAttachment, transitGatewayRouteTable }) =>
          `${transitGatewayVpcAttachment}::${transitGatewayRouteTable}`,
        tap((params) => {
          assert(true);
        }),
      ])(),
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
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateTransitGatewayRouteTable-property
    create:
      ({ endpoint }) =>
      ({ payload }) =>
        tryCatch(
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => payload,
            tap(
              ({ TransitGatewayAttachmentId, TransitGatewayRouteTableId }) => {
                assert(endpoint);
                assert(payload);
                assert(TransitGatewayAttachmentId);
                assert(TransitGatewayRouteTableId);
              }
            ),
            endpoint().associateTransitGatewayRouteTable,
          ]),
          pipe([
            switchCase([
              isAwsError("Resource.AlreadyAssociated"),
              () => {},
              (error) => {
                throw error;
              },
            ]),
          ])
        )(),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateTransitGatewayRouteTable-property
    destroy:
      ({ endpoint }) =>
      ({ live }) =>
        pipe([
          tap((params) => {
            assert(live);
            assert(endpoint);
          }),
          () => live,
          endpoint().disassociateTransitGatewayRouteTable,
          tap((params) => {
            assert(true);
          }),
        ])(),
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
          //TODO direct connect
          assert(transitGatewayVpcAttachment);
        }),
        () => properties,
        defaultsDeep({
          TransitGatewayRouteTableId: getField(
            transitGatewayRouteTable,
            "TransitGatewayRouteTableId"
          ),
          TransitGatewayAttachmentId: getField(
            transitGatewayVpcAttachment,
            "TransitGatewayAttachmentId"
          ),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
