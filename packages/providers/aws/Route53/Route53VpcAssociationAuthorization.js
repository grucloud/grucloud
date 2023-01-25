const assert = require("assert");
const { pipe, tap, get, pick, eq, fork, map } = require("rubico");
const {
  defaultsDeep,
  find,
  unless,
  isEmpty,
  when,
  isObject,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53VpcAssociationAuthorization = ({ compare }) => ({
  type: "VpcAssociationAuthorization",
  package: "route-53",
  client: "Route53",
  inferName: ({ dependenciesSpec: { hostedZone, vpc } }) =>
    pipe([
      () => vpc,
      when(isObject, get("name")),
      (vpc) => `vpc-assoc-auth::${hostedZone}::${vpc}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          vpcName: pipe([
            get("VPC.VPCId"),
            tap((id) => {
              assert(id);
            }),
            (id) =>
              pipe([
                () => id,
                lives.getById({
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
                }),
                get("name", id),
              ])(),
          ]),
          hostedZoneName: pipe([
            get("HostedZoneId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "HostedZone",
              group: "Route53",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ vpcName, hostedZoneName }) => {
          assert(vpcName);
          assert(hostedZoneName);
        }),
        ({ hostedZoneName, vpcName }) =>
          `vpc-assoc-auth::${hostedZoneName}::${vpcName}`,
        tap((params) => {
          assert(true);
        }),
      ])(),
  findId: () =>
    pipe([({ HostedZoneId, VPC: { VPCId } }) => `${HostedZoneId}::${VPCId}`]),
  omitProperties: ["HostedZoneId", "VPC"],
  compare: compare({
    filterTarget: () => pipe([() => ({})]),
    filterLive: () => pipe([() => ({})]),
  }),
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
      dependencyId: ({ lives, config }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("VPC"),
          ({ VPCRegion, VPCId }) =>
            pipe([
              () => VPCId,
              lives.getById({ type: "Vpc", group: "EC2" }),
              pick(["id", "providerName"]),
            ])(),
        ]),
    },
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listVPCAssociationAuthorizations-property
  getList: ({ client, endpoint, config }) =>
    pipe([
      tap((params) => {
        assert(client);
        assert(endpoint);
        assert(config);
      }),
      () =>
        client.getListWithParent({
          parent: { type: "HostedZone", group: "Route53" },
          pickKey: pipe([pick(["HostedZoneId"])]),
          method: "listVPCAssociationAuthorizations",
          decorate:
            ({ lives, parent }) =>
            ({ HostedZoneId, VPCs }) =>
              pipe([
                () => VPCs,
                tap((params) => {
                  assert(true);
                }),
                map((VPC) => ({ HostedZoneId, VPC })),
                tap((params) => {
                  assert(true);
                }),
              ])(),
          config,
        }),
    ])(),
  ignoreErrorCodes: ["UnknownResourceException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createVPCAssociationAuthorization-property
  create: {
    method: "createVPCAssociationAuthorization",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteVPCAssociationAuthorization-property
  destroy: {
    method: "deleteVPCAssociationAuthorization",
    pickId: pipe([pick(["HostedZoneId", "VPC"])]),
  },
  getByName:
    ({ getList, endpoint }) =>
    ({ name, resolvedDependencies: { hostedZone, vpc } }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => hostedZone,
        get("live.Id"),
        (Id) => ({ HostedZoneId: Id }),
        endpoint().listVPCAssociationAuthorizations,
        tap((params) => {
          assert(true);
        }),
        ({ HostedZoneId, VPCs }) =>
          pipe([
            () => VPCs,
            find(eq(get("VPCId"), vpc.live.VpcId)),
            tap((params) => {
              assert(true);
            }),
            unless(isEmpty, (VPC) => ({ HostedZoneId, VPC })),
          ])(),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otheProps },
    dependencies: { hostedZone, vpc },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(hostedZone);
        assert(vpc);
      }),
      () => otheProps,
      defaultsDeep({
        HostedZoneId: getField(hostedZone, "HostedZoneId"),
        VPC: {
          VPCId: getField(vpc, "VpcId"),
          VPCRegion: get("resource.provider.config.region")(vpc),
        },
      }),
    ])(),
});
