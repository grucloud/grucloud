const assert = require("assert");
const { pipe, tap, get, pick, eq, fork, not, map } = require("rubico");
const { defaultsDeep, find, unless, isEmpty } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const model = ({ config }) => ({
  package: "route-53",
  client: "Route53",
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53VpcAssociationAuthorization = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
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
                  () =>
                    lives.getById({
                      id,
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
              (id) =>
                lives.getById({
                  id,
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
