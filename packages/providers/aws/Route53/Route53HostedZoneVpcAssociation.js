const assert = require("assert");
const { pipe, tap, get, eq, pick, fork, flatMap, map } = require("rubico");
const { defaultsDeep, find, unless, isEmpty, first } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  pick(["HostedZoneId", "VPC"]),
]);

const createModel = ({ config }) => ({
  ignoreErrorCodes: ["AccessDenied"],
  package: "route-53",
  client: "Route53",
  // TODO You can't disassociate the last Amazon VPC from a private hosted zone.

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#associateVPCWithHostedZone-property
  create: { method: "associateVPCWithHostedZone" },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#disassociateVPCFromHostedZone-property
    method: "disassociateVPCFromHostedZone",
  },
});

// do not manage the first vpc association with this hosted zone
const managedByOther =
  ({ config }) =>
  ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          id: live.HostedZoneId,
          type: "HostedZone",
          group: "Route53",
          providerName: config.providerName,
        }),
      get("VpcAssociations"),
      first,
      eq(get("VPCId"), live.VPCId),
    ])();

const findId = pipe([
  get("live"),
  unless(
    isEmpty,
    ({ HostedZoneId, VPCId }) => `zone-assoc::${HostedZoneId}::${VPCId}`
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53HostedZoneVpcAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    managedByOther: managedByOther({ config }),
    findDependencies: ({ live }) => [
      {
        type: "Vpc",
        group: "EC2",
        ids: [pipe([() => live, get("VPC.VPCId")])()],
      },
      {
        type: "HostedZone",
        group: "Route53",
        ids: [live.HostedZoneId],
      },
    ],
    findName: ({ live, lives }) =>
      pipe([
        fork({
          vpc: pipe([
            () => live,
            get("VPC.VPCId"),
            (id) =>
              lives.getById({
                id,
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
          hostedZone: pipe([
            tap((params) => {
              assert(live.HostedZoneId);
            }),
            () =>
              lives.getById({
                id: live.HostedZoneId,
                type: "HostedZone",
                group: "Route53",
                providerName: config.providerName,
              }),
            get("name"),
          ]),
        }),
        tap(({ vpc, hostedZone }) => {
          assert(vpc);
          assert(hostedZone);
        }),
        ({ vpc, hostedZone }) => `zone-assoc::${hostedZone}::${vpc}`,
      ])(),
    findId,
    pickId,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZonesByVPC-property
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "Vpc",
              group: "EC2",
            }),
          flatMap(({ id }) =>
            pipe([
              tap((params) => {
                assert(id);
              }),
              () => ({
                VPCId: id,
                VPCRegion: config.region,
              }),
              endpoint().listHostedZonesByVPC,
              get("HostedZoneSummaries"),
              tap((params) => {
                assert(true);
              }),
              map(defaultsDeep({ VPC: { VPCId: id } })),
            ])()
          ),
        ])(),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property
    getByName:
      ({ endpoint }) =>
      ({ resolvedDependencies: { vpc, hostedZone } }) =>
        pipe([
          tap((params) => {
            assert(vpc);
            assert(vpc.id);
            assert(hostedZone);
            assert(hostedZone.id);
          }),
          () => ({
            VPCId: vpc.id,
            VPCRegion: config.region,
          }),
          endpoint().listHostedZonesByVPC,
          get("HostedZoneSummaries"),
          find(eq(get("HostedZoneId"), hostedZone.id)),
        ])(),
    configDefault: ({ properties, dependencies: { vpc, hostedZone } }) =>
      pipe([
        tap(() => {
          assert(vpc);
          assert(hostedZone);
        }),
        () => properties,
        defaultsDeep({
          VPC: {
            VPCId: getField(vpc, "VpcId"),
            //TODO get region from vpc
            VPCRegion: config.region,
          },
          HostedZoneId: getField(hostedZone, "Id"),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
