const assert = require("assert");
const {
  pipe,
  tap,
  get,
  flatMap,
  map,
  fork,
  pick,
  eq,
  filter,
  not,
} = require("rubico");
const { defaultsDeep, find, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pick(["VpcId", "VpnGatewayId"]);

const findId = () =>
  pipe([
    ({ VpcId, VpnGatewayId }) => `vpn-gw-attach::${VpnGatewayId}::${VpcId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnGatewayAttachment = ({ compare }) => ({
  type: "VpnGatewayAttachment",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpnGatewayID.NotFound"],
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          vpc: pipe([
            get("VpcId"),
            lives.getById({
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name", live.VpcId),
          ]),
          vpnGateway: pipe([
            get("VpnGatewayId"),
            lives.getById({
              type: "VpnGateway",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ vpc, vpnGateway }) => {
          assert(vpc);
          assert(vpnGateway);
        }),
        ({ vpc, vpnGateway }) => `vpn-gw-attach::${vpnGateway}::${vpc}`,
      ])(),
  findId,
  pickId,
  ignoreResource: () => pipe([get("live"), eq(get("State"), "detached")]),
  omitProperties: ["VpnGatewayId", "VpcId", "State"],
  compare: compare({ filterAll: () => pick([]) }),
  inferName:
    ({ dependenciesSpec: { vpc, vpnGateway } }) =>
    () =>
      `vpn-gw-attach::${vpnGateway}::${vpc}`,
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    vpnGateway: {
      type: "VpnGateway",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpnGatewayId"),
    },
  },
  getById: {
    method: "describeVpnGateways",
    getField: "VpnGateways",
    pickId: pipe([
      tap(({ VpnGatewayId, VpcId }) => {
        assert(VpnGatewayId);
        assert(VpcId);
      }),
      ({ VpnGatewayId }) => ({
        VpnGatewayIds: [VpnGatewayId],
      }),
    ]),
    decorate: ({ live, endpoint, config }) =>
      pipe([
        tap(({ VpcAttachments }) => {
          assert(live.VpcId);
          assert(VpcAttachments);
        }),
        get("VpcAttachments"),
        find(eq(get("VpcId"), live.VpcId)),
        defaultsDeep(live),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#attachVpnGateway-property
  create: {
    method: "attachVpnGateway",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("State"), "attached")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#detachVpnGateway-property
  destroy: {
    method: "detachVpnGateway",
    pickId,
    ignoreErrorCodes: ["InvalidVpnGatewayID.NotFound"],
    isInstanceDown: pipe([eq(get("State"), "detached")]),
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "VpnGateway",
          group: "EC2",
        }),
        flatMap(
          pipe([
            get("live"),
            ({ VpnGatewayId, VpcAttachments = [] }) =>
              pipe([
                () => VpcAttachments,
                map(defaultsDeep({ VpnGatewayId })),
              ])(),
          ])
        ),
        filter(not(eq(get("State"), "detached"))),
      ])(),
  getByName:
    ({ getById, endpoint }) =>
    ({ resolvedDependencies: { vpc, vpnGateway } }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(vpc);
          assert(vpnGateway);
        }),
        () => ({
          VpnGatewayIds: [vpnGateway.live.VpnGatewayId],
        }),
        endpoint().describeVpnGateways,
        get("VpnGateways"),
        first,
        get("VpcAttachments"),
        find(eq(get("VpcId"), vpc.live.VpcId)),
      ])(),
  configDefault: ({ properties, dependencies: { vpc, vpnGateway }, config }) =>
    pipe([
      tap(() => {
        assert(vpc);
        assert(vpnGateway);
      }),
      () => ({
        VpcId: getField(vpc, "VpcId"),
        VpnGatewayId: getField(vpnGateway, "VpnGatewayId"),
      }),
    ])(),
});
