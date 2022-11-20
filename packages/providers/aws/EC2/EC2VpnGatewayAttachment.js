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
const { defaultsDeep, unless, isEmpty, find, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["VpcId", "VpnGatewayId"]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpnGatewayID.NotFound"],
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
});

const findId = () =>
  pipe([
    ({ VpcId, VpnGatewayId }) => `vpn-gw-attach::${VpnGatewayId}::${VpcId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnGatewayAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName:
      ({ lives }) =>
      (live) =>
        pipe([
          fork({
            vpc: pipe([
              () =>
                lives.getById({
                  id: live.VpcId,
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              get("name", live.VpcId),
            ]),
            vpnGateway: pipe([
              () =>
                lives.getById({
                  id: live.VpnGatewayId,
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
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
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
    configDefault: ({ properties, dependencies: { vpc, vpnGateway } }) =>
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
