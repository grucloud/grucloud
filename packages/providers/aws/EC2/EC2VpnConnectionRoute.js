const assert = require("assert");
const {
  pipe,
  tap,
  get,
  flatMap,
  map,
  pick,
  eq,
  filter,
  not,
} = require("rubico");
const { defaultsDeep, find, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pick(["VpnConnectionId", "DestinationCidrBlock"]);
const ignoreErrorCodes = ["InvalidVpnConnectionID.NotFound"];

const findId = () =>
  pipe([
    ({ VpnConnectionId, DestinationCidrBlock }) =>
      `vpn-conn-route::${VpnConnectionId}::${DestinationCidrBlock}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnConnectionRoute = ({ compare }) => ({
  type: "VpnConnectionRoute",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes,
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("VpnConnectionId"),
        lives.getById({
          type: "VpnConnection",
          group: "EC2",
          providerName: config.providerName,
        }),
        get("name", live.VpnConnectionId),
        tap((vpnConnection) => {
          assert(vpnConnection);
        }),
        (vpnConnection) =>
          `vpn-conn-route::${vpnConnection}::${live.DestinationCidrBlock}`,
      ])(),
  findId,
  pickId,
  inferName:
    ({ dependenciesSpec: { vpnConnection } }) =>
    ({ DestinationCidrBlock }) =>
      `vpn-conn-route::${vpnConnection}::${DestinationCidrBlock}`,
  omitProperties: ["VpnConnectionId", "State"],
  dependencies: {
    vpnConnection: {
      type: "VpnConnection",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpnConnectionId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpnConnections-property
  getById: {
    method: "describeVpnConnections",
    getField: "VpnConnections",
    pickId: pipe([
      ({ VpnConnectionId }) => ({ VpnConnectionIds: [VpnConnectionId] }),
    ]),
    decorate: ({ live, endpoint, config }) =>
      pipe([
        tap(({ Routes }) => {
          assert(live.VpnConnectionId);
          assert(Routes);
        }),
        get("Routes"),
        find(eq(get("DestinationCidrBlock"), live.DestinationCidrBlock)),
        defaultsDeep(live),
      ]),
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "VpnConnection",
          group: "EC2",
        }),
        flatMap(
          pipe([
            get("live"),
            ({ VpnConnectionId, Routes = [] }) =>
              pipe([() => Routes, map(defaultsDeep({ VpnConnectionId }))])(),
          ])
        ),
        filter(not(eq(get("State"), "deleted"))),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpnConnectionRoute-property
  create: {
    method: "createVpnConnectionRoute",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVpnConnectionRoute-property
  destroy: {
    method: "deleteVpnConnectionRoute",
    pickId,
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
  },

  getByName:
    ({ getById, endpoint }) =>
    ({ properties, resolvedDependencies: { vpnConnection } }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(vpnConnection);
          assert(properties({}).DestinationCidrBlock);
        }),
        () => ({
          VpnConnectionIds: [vpnConnection.live.VpnConnectionId],
        }),
        endpoint().describeVpnConnections,
        get("VpnConnections"),
        first,
        get("Routes"),
        find(
          eq(get("DestinationCidrBlock"), properties({}).DestinationCidrBlock)
        ),
      ])(),
  configDefault: ({
    properties: { DestinationCidrBlock },
    dependencies: { vpnConnection },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(DestinationCidrBlock);
        assert(vpnConnection);
      }),
      () => ({
        DestinationCidrBlock,
        VpnConnectionId: getField(vpnConnection, "VpnConnectionId"),
      }),
    ])(),
});
