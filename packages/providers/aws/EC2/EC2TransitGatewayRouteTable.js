const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep, append, prepend, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const managedByOther = get("live.DefaultAssociationRouteTable");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  getById: {
    method: "describeTransitGatewayRouteTables",
    getField: "TransitGatewayRouteTables",
  },
  getList: {
    method: "describeTransitGatewayRouteTables",
    getParam: "TransitGatewayRouteTables",
  },
  create: { method: "createTransitGatewayRouteTable" },
  destroy: { method: "deleteTransitGatewayRouteTable" },
});

const findId = pipe([
  get("live.TransitGatewayRouteTableId"),
  tap((TransitGatewayRouteTableId) => {
    assert(TransitGatewayRouteTableId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayRouteTable = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    managedByOther,
    cannotBeDeleted: managedByOther,
    findDependencies: ({ live }) => [
      {
        type: "TransitGateway",
        group: "EC2",
        ids: [
          `arn:aws:ec2:${config.region}:${config.accountId()}:transit-gateway/${
            live.TransitGatewayId
          }`,
        ],
      },
    ],
    findName: pipe([
      tap((params) => {
        assert(true);
      }),
      switchCase([
        get("live.DefaultAssociationRouteTable"),
        ({ live, lives }) =>
          pipe([
            () =>
              lives.getByType({
                id: live.TransitGatewayId,
                type: "TransitGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
            tap((params) => {
              assert(true);
            }),
            find(eq(get("live.TransitGatewayId"), live.TransitGatewayId)),
            tap((params) => {
              assert(true);
            }),
            get("name"),
            append("-default"),
            prepend("tgw-rtb-"),
          ])(),
        findNameInTagsOrId({ findId }),
      ]),
      tap((params) => {
        assert(true);
      }),
    ]),
    pickId: pipe([
      tap(({ TransitGatewayRouteTableId }) => {
        assert(TransitGatewayRouteTableId);
      }),
      ({ TransitGatewayRouteTableId }) => ({
        TransitGatewayRouteTableIds: [TransitGatewayRouteTableId],
      }),
    ]),
    pickIdDestroy: pipe([
      tap(({ TransitGatewayRouteTableId }) => {
        assert(TransitGatewayRouteTableId);
      }),
      pick(["TransitGatewayRouteTableId"]),
    ]),
    findId,
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),

    pickCreated: ({ payload }) => pipe([get("TransitGatewayRouteTable")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { transitGateway },
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
