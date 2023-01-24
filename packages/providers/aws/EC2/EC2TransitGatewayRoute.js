const assert = require("assert");
const { pipe, tap, get, pick, fork, switchCase, omit, map } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { tagResource, untagResource } = require("./EC2Common");
const {
  findDependenciesTgwAttachment,
  findNameRouteTableArm,
  transitGatewayAttachmentDependencies,
  inferNameRouteTableArm,
} = require("./EC2TransitGatewayCommon");

//TODO cannotBeDelete State = Deleted
const findId = () =>
  pipe([
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRoute = ({ compare }) => ({
  type: "TransitGatewayRoute",
  package: "ec2",
  client: "EC2",
  inferName:
    ({ dependenciesSpec }) =>
    (properties) =>
      pipe([
        () => properties,
        inferNameRouteTableArm({ prefix: "tgw-route" })({
          dependenciesSpec,
        }),
        append(`::${properties.DestinationCidrBlock}`),
      ])(),
  findName:
    ({ lives }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.DestinationCidrBlock);
        }),
        () => live,
        findNameRouteTableArm({
          prefix: "tgw-route",
        })({ lives, config }),
        append(`::${live.DestinationCidrBlock}`),
        tap((params) => {
          assert(true);
        }),
      ])(),
  findId,
  findDependencies: ({ live, lives }) => [
    {
      type: "TransitGatewayRouteTable",
      group: "EC2",
      ids: [live.TransitGatewayRouteTableId],
    },
    findDependenciesTgwAttachment({ live, lives, config }),
  ],
  omitProperties: [
    "TransitGatewayRouteTableId",
    "TransitGatewayAttachmentId",
    "TransitGatewayId",
    "State",
    "CreationTime",
  ],
  dependencies: {
    transitGatewayRouteTable: {
      type: "TransitGatewayRouteTable",
      group: "EC2",
      parent: true,
    },
    ...transitGatewayAttachmentDependencies,
  },
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#searchTransitGatewayRoutes-property
  getList: ({ client, config }) =>
    pipe([
      client.getListWithParent({
        parent: { type: "TransitGatewayRouteTable", group: "EC2" },
        config,
        pickKey: pipe([
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
                  omitIfEmpty(["TransitGatewayRouteTableAnnouncementId"]),
                  defaultsDeep({
                    TransitGatewayRouteTableId,
                    TransitGatewayAttachmentId,
                  }),
                ])()
              ),
            ])(),
      }),
    ]),
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { transitGatewayRouteTable, transitGatewayVpcAttachment },
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
