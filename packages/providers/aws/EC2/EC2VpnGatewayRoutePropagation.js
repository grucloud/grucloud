const assert = require("assert");
const { pipe, tap, get, flatMap, map, fork, pick, eq } = require("rubico");
const { defaultsDeep, find, first, unless, isEmpty } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pick(["RouteTableId", "GatewayId"]);

const findId = () =>
  pipe([
    ({ RouteTableId, GatewayId }) => `vpn-gw-rt::${GatewayId}::${RouteTableId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnGatewayRoutePropagation = ({ compare }) => ({
  type: "VpnGatewayRoutePropagation",
  package: "ec2",
  client: "EC2",
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          routeTable: pipe([
            get("RouteTableId"),
            lives.getById({
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
            get("GatewayId"),
            lives.getById({
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
  omitProperties: ["GatewayId", "RouteTableId", "State"],
  compare: compare({ filterAll: () => pick([]) }),
  inferName:
    ({ dependenciesSpec: { routeTable, vpnGateway } }) =>
    () =>
      `vpn-gw-rt::${vpnGateway}::${routeTable}`,
  dependencies: {
    routeTable: {
      type: "RouteTable",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("RouteTableId"),
    },
    vpnGateway: {
      type: "VpnGateway",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("GatewayId"),
    },
  },
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
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
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
  configDefault: ({
    properties,
    dependencies: { routeTable, vpnGateway },
    config,
  }) =>
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
