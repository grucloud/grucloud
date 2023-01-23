const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep, append, prepend, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const managedByOther = () => get("DefaultAssociationRouteTable");

const findId = () => pipe([get("TransitGatewayRouteTableId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRouteTable = ({ compare }) => ({
  type: "TransitGatewayRouteTable",
  package: "ec2",
  client: "EC2",
  managedByOther,
  cannotBeDeleted: managedByOther,
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        switchCase([
          get("DefaultAssociationRouteTable"),
          pipe([
            get("TransitGatewayId"),
            lives.getByType({
              type: "TransitGateway",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(eq(get("live.TransitGatewayId"), live.TransitGatewayId)),
            get("name", ""),
            tap((name) => {
              //assert(name);
            }),
            append("-default"),
            prepend("tgw-rtb-"),
          ]),
          findNameInTagsOrId({ findId })({ lives, config }),
        ]),
      ])(),
  pickId: pipe([
    tap(({ TransitGatewayRouteTableId }) => {
      assert(TransitGatewayRouteTableId);
    }),
    ({ TransitGatewayRouteTableId }) => ({
      TransitGatewayRouteTableIds: [TransitGatewayRouteTableId],
    }),
  ]),
  findId,
  omitProperties: [
    "TransitGatewayRouteTableId",
    "TransitGatewayId",
    "CreationTime",
    "State",
  ],
  dependencies: {
    transitGateway: {
      type: "TransitGateway",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("TransitGatewayId"),
    },
  },
  ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  getById: {
    method: "describeTransitGatewayRouteTables",
    getField: "TransitGatewayRouteTables",
  },
  getList: {
    method: "describeTransitGatewayRouteTables",
    getParam: "TransitGatewayRouteTables",
  },
  create: {
    method: "createTransitGatewayRouteTable",
    isInstanceUp: pipe([eq(get("State"), "available")]),
    pickCreated: ({ payload }) => pipe([get("TransitGatewayRouteTable")]),
  },
  destroy: {
    method: "deleteTransitGatewayRouteTable",
    pickId: pipe([pick(["TransitGatewayRouteTableId"])]),
    shouldRetryOnExceptionMessages: ["has associated attachments"],
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { transitGateway },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(transitGateway);
      }),
      () => otherProps,
      defaultsDeep({
        TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
        TagSpecifications: [
          {
            ResourceType: "transit-gateway-route-table",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
