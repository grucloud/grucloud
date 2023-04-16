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
  not,
} = require("rubico");
const {
  defaultsDeep,
  find,
  first,
  identity,
  when,
  isObject,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["HostedZoneId", "VPC"])]);

// Do not manage the first vpc association with this hosted zone,
const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      or([
        get("Owner.OwningService"),
        //not(eq(get("Owner.OwningAccount"), config.accountId())),
        pipe([
          get("HostedZoneId"),
          lives.getById({
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
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      or([
        get("Owner.OwningService"),
        pipe([
          get("HostedZoneId"),
          lives.getById({
            type: "HostedZone",
            group: "Route53",
          }),
          get("live.VpcAssociations"),
          first,
          and([eq(get("VPCId"), live.VPC.VPCId)]),
        ]),
      ]),
    ])();

const findId = () =>
  pipe([
    tap(({ HostedZoneId, VPC }) => {
      assert(VPC);
      assert(VPC.VPCId);
      assert(HostedZoneId);
    }),
    ({ HostedZoneId, VPC: { VPCId } }) =>
      `zone-assoc::${HostedZoneId}::${VPCId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53ZoneVpcAssociation = ({ compare }) => ({
  type: "ZoneVpcAssociation",
  package: "route-53",
  client: "Route53",
  ignoreErrorCodes: ["AccessDenied", "NoSuchHostedZone"],
  managedByOther: managedByOther,
  cannotBeDeleted: cannotBeDeleted,
  inferName: ({ dependenciesSpec: { hostedZone, vpc } }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => hostedZone,
      when(isObject, get("name")),
      (hostedZone) => `zone-assoc::${hostedZone}::${vpc}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          vpc: pipe([
            get("VPC.VPCId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
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
                () => id,
                lives.getById({
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
  dependencies: {
    hostedZone: {
      type: "HostedZone",
      group: "Route53",
      parent: true,
      dependencyId: ({ lives, config }) => get("HostedZoneId"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VPC.VPCId"),
    },
  },
  omitProperties: ["HostedZoneId", "Name", "Owner", "VPC"],
  compare: compare({
    filterTarget: () => pipe([() => ({})]),
    filterLive: () => pipe([() => ({})]),
  }),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZonesByVPC-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
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
            map(defaultsDeep({ VPC: { VPCId: id, VPCRegion: config.region } })),
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
  configDefault: ({ properties, dependencies: { vpc, hostedZone }, config }) =>
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
