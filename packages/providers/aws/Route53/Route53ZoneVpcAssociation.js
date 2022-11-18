const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  fork,
  flatMap,
  map,
  and,
  or,
} = require("rubico");
const { defaultsDeep, find, first, identity } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([pick(["HostedZoneId", "VPC"])]);

const createModel = ({ config }) => ({
  ignoreErrorCodes: ["AccessDenied", "NoSuchHostedZone"],
  package: "route-53",
  client: "Route53",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#associateVPCWithHostedZone-property
  create: {
    method: "associateVPCWithHostedZone",
    shouldRetryOnExceptionMessages: [
      "because no resource-based policy allows the route53:AssociateVPCWithHostedZone action",
    ],
  },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#disassociateVPCFromHostedZone-property
    method: "disassociateVPCFromHostedZone",
    pickId,
  },
});

// Do not manage the first vpc association with this hosted zone,
const managedByOther =
  ({ config }) =>
  ({ live, lives }) =>
    pipe([
      () => live,
      or([
        get("Owner.OwningService"),
        pipe([
          () =>
            lives.getById({
              id: live.HostedZoneId,
              type: "HostedZone",
              group: "Route53",
            }),
          get("dependencies"),
          find(eq(get("type"), "Vpc")),
          get("ids"),
          first,
          eq(identity, live.VPC.VPCId),
        ]),
      ]),
    ])();

const cannotBeDeleted =
  ({ config }) =>
  ({ live, lives }) =>
    pipe([
      () => live,
      or([
        get("Owner.OwningService"),
        pipe([
          () =>
            lives.getById({
              id: live.HostedZoneId,
              type: "HostedZone",
              group: "Route53",
            }),
          get("live.VpcAssociations"),
          first,
          and([eq(get("VPCId"), live.VPC.VPCId)]),
        ]),
      ]),
    ])();

const findId = pipe([
  get("live"),
  tap(({ HostedZoneId, VPC }) => {
    assert(VPC);
    assert(VPC.VPCId);
    assert(HostedZoneId);
  }),
  ({ HostedZoneId, VPC: { VPCId } }) => `zone-assoc::${HostedZoneId}::${VPCId}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53ZoneVpcAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    managedByOther: managedByOther({ config }),
    cannotBeDeleted: cannotBeDeleted({ config }),
    findName: ({ live, lives }) =>
      pipe([
        () => live,
        fork({
          vpc: pipe([
            get("VPC.VPCId"),
            tap((id) => {
              assert(id);
            }),
            (id) =>
              lives.getById({
                id,
                type: "Vpc",
                group: "EC2",
              }),
            get("name"),
          ]),
          hostedZone: pipe([
            get("HostedZoneId"),
            tap((id) => {
              assert(id);
            }),
            (id) =>
              pipe([
                () =>
                  lives.getById({
                    id,
                    type: "HostedZone",
                    group: "Route53",
                    providerName: config.providerName,
                  }),
                get("name", id),
              ])(),
          ]),
        }),
        tap(({ vpc, hostedZone }) => {
          assert(vpc);
          assert(hostedZone);
        }),
        ({ vpc, hostedZone }) => `zone-assoc::${hostedZone}::${vpc}`,
      ])(),
    findId,
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
              () => ({
                VPCId: id,
                VPCRegion: config.region,
              }),
              endpoint().listHostedZonesByVPC,
              get("HostedZoneSummaries"),
              map(
                defaultsDeep({ VPC: { VPCId: id, VPCRegion: config.region } })
              ),
            ])()
          ),
        ])(),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZonesByVPC-property
    getByName:
      ({ endpoint }) =>
      ({ resolvedDependencies: { vpc, hostedZone } }) =>
        pipe([
          tap((params) => {
            assert(vpc);
            assert(hostedZone);
          }),
          () => ({
            VPCId: getField(vpc, "VpcId"),
            VPCRegion: get("resource.provider.config.region")(vpc),
          }),
          endpoint().listHostedZonesByVPC,
          get("HostedZoneSummaries"),
          find(eq(get("HostedZoneId"), getField(hostedZone, "HostedZoneId"))),
          defaultsDeep({
            VPC: {
              VPCId: getField(vpc, "VpcId"),
              VPCRegion: get("resource.provider.config.region")(vpc),
            },
          }),
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
            VPCRegion: get("resource.provider.config.region")(vpc),
          },
          HostedZoneId: getField(hostedZone, "HostedZoneId"),
        }),
      ])(),
  });
