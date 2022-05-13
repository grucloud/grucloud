const assert = require("assert");
const { pipe, tap, get, pick, fork, switchCase, omit, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

//TODO cannotBeDelete State = Deleted
const findId = pipe([
  get("live"),
  tap(
    ({
      TransitGatewayAttachmentId,
      TransitGatewayRouteTableId,
      DestinationCidrBlock,
    }) => {
      assert(TransitGatewayAttachmentId);
      assert(TransitGatewayRouteTableId);
      assert(DestinationCidrBlock);
    }
  ),
  ({
    TransitGatewayAttachmentId,
    TransitGatewayRouteTableId,
    DestinationCidrBlock,
  }) =>
    `${TransitGatewayAttachmentId}::${TransitGatewayRouteTableId}::${DestinationCidrBlock}`,
]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTransitGatewayRoute-property
  create: {
    method: "createTransitGatewayRoute",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTransitGatewayRoute-property
  destroy: {
    method: "deleteTransitGatewayRoute",
    pickId: pipe([
      tap(({ DestinationCidrBlock, TransitGatewayRouteTableId }) => {
        assert(DestinationCidrBlock);
        assert(TransitGatewayRouteTableId);
      }),
      pick(["DestinationCidrBlock", "TransitGatewayRouteTableId"]),
    ]),
    ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRoute = ({ spec, config }) =>
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
            tap((params) => {
              assert(live.TransitGatewayAttachmentId);
            }),
            () =>
              lives.getById({
                id: live.TransitGatewayAttachmentId,
                type: "TransitGatewayVpcAttachment",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("id"),
            tap((params) => {
              assert(true);
            }),
          ])(),
        ],
      },
      //TODO more attachment type
    ],
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#searchTransitGatewayRoutes-property
    getList: ({ client }) =>
      pipe([
        client.getListWithParent({
          parent: { type: "TransitGatewayRouteTable", group: "EC2" },
          config,
          pickKey: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["TransitGatewayRouteTableId"]),
            defaultsDeep({
              Filters: [
                {
                  Name: "type",
                  Values: ["static"],
                },
              ],
            }),
          ]),
          method: "searchTransitGatewayRoutes",
          getParam: "Routes",
          decorate:
            ({ lives, parent: { TransitGatewayRouteTableId } }) =>
            (route) =>
              pipe([
                () => route,
                get("TransitGatewayAttachments"),
                map(({ TransitGatewayAttachmentId }) =>
                  pipe([
                    () => route,
                    omit(["TransitGatewayAttachments", "Type"]),
                    defaultsDeep({
                      TransitGatewayRouteTableId,
                      TransitGatewayAttachmentId,
                    }),
                  ])()
                ),
                tap((params) => {
                  assert(true);
                }),
              ])(),
        }),
      ]),
    findName: ({ live, lives }) =>
      pipe([
        tap((params) => {
          assert(live.DestinationCidrBlock);
        }),
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
          `tgw-route::${transitGatewayVpcAttachment}::${transitGatewayRouteTable}::${live.DestinationCidrBlock}`,
        tap((params) => {
          assert(true);
        }),
      ])(),
    findId,
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
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
