const assert = require("assert");
const { pipe, tap, get, flatMap, map, fork, pick, eq } = require("rubico");
const { defaultsDeep, find, first, unless, isEmpty } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["RouteTableId", "GatewayId"]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  // getById: {
  //   method: "describeRouteTables",
  //   getField: "RouteTables",
  //   pickId: pipe([
  //     tap(({ VpnGatewayId, RouteTableId }) => {
  //       assert(VpnGatewayId);
  //       assert(RouteTableId);
  //     }),
  //     ({ RouteTableId }) => ({
  //       RouteTableIds: [RouteTableId],
  //     }),
  //   ]),
  //   decorate: ({ live, endpoint, config }) =>
  //     pipe([
  //       tap(() => {
  //         assert(live.RouteTableId);
  //       }),
  //       get("PropagatingVgws"),
  //       find(eq(get("GatewayId"), live.GatewayId)),
  //       unless(isEmpty, pipe([defaultsDeep(live)])),
  //       tap((params) => {
  //         assert(true);
  //       }),
  //     ]),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#enableVgwRoutePropagation-property
  create: {
    method: "enableVgwRoutePropagation",
    shouldRetryOnExceptionCodes: ["Gateway.NotAttached"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disableVgwRoutePropagation-property
  destroy: {
    method: "disableVgwRoutePropagation",
    pickId,
    ignoreErrorCodes: [
      "InvalidVpnGatewayID.NotFound",
      "InvalidRouteTableID.NotFound",
    ],
  },
});

const findId = pipe([
  get("live"),
  ({ RouteTableId, GatewayId }) => `vpn-gw-rt::${GatewayId}::${RouteTableId}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnGatewayRoutePropagation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        fork({
          routeTable: pipe([
            () =>
              lives.getById({
                id: live.RouteTableId,
                type: "RouteTable",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name", live.RouteTableId),
          ]),
          vpnGateway: pipe([
            tap((params) => {
              assert(live.GatewayId);
            }),
            () =>
              lives.getById({
                id: live.GatewayId,
                type: "VpnGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
        }),
        tap(({ routeTable, vpnGateway }) => {
          assert(routeTable);
          assert(vpnGateway);
        }),
        ({ routeTable, vpnGateway }) =>
          `vpn-gw-rt::${vpnGateway}::${routeTable}`,
      ])(),
    findId,
    pickId,
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "RouteTable",
              group: "EC2",
            }),
          flatMap(
            pipe([
              get("live"),
              ({ RouteTableId, PropagatingVgws = [] }) =>
                pipe([
                  () => PropagatingVgws,
                  map(defaultsDeep({ RouteTableId })),
                ])(),
            ])
          ),
        ])(),
    getByName:
      ({ getById, endpoint }) =>
      ({ resolvedDependencies: { routeTable, vpnGateway } }) =>
        pipe([
          tap((params) => {
            assert(endpoint);
            assert(routeTable);
            assert(routeTable.live.RouteTableId);
            assert(vpnGateway.live.VpnGatewayId);
            assert(vpnGateway);
          }),
          () => ({
            RouteTableIds: [routeTable.live.RouteTableId],
          }),
          endpoint().describeRouteTables,
          get("RouteTables"),
          first,
          get("PropagatingVgws"),
          find(eq(get("GatewayId"), vpnGateway.live.VpnGatewayId)),
          unless(
            isEmpty,
            pipe([defaultsDeep({ GatewayId: vpnGateway.live.VpnGatewayId })])
          ),
        ])(),
    configDefault: ({ properties, dependencies: { routeTable, vpnGateway } }) =>
      pipe([
        tap(() => {
          assert(routeTable);
          assert(vpnGateway);
        }),
        () => ({
          RouteTableId: getField(routeTable, "RouteTableId"),
          GatewayId: getField(vpnGateway, "VpnGatewayId"),
        }),
      ])(),
  });
