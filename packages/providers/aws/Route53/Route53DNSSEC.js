const assert = require("assert");
const { pipe, tap, get, pick, eq, map, switchCase } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ HostedZoneId }) => {
    assert(HostedZoneId);
  }),
  pick(["HostedZoneId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.HostedZoneId);
    }),
    defaultsDeep({ HostedZoneId: live.HostedZoneId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53DNSSEC = () => ({
  type: "DNSSEC",
  package: "route-53",
  client: "Route53",
  propertiesDefault: {},
  omitProperties: ["KeySigningKeys", "Status.StatusMessage"],
  inferName:
    ({ dependenciesSpec: { hostedZone } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(hostedZone);
        }),
        () => `${hostedZone}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ HostedZoneId }) =>
      pipe([
        tap((params) => {
          assert(HostedZoneId);
        }),
        () => HostedZoneId,
        lives.getById({
          type: "HostedZoneId",
          group: "Route53",
          providerName: config.providerName,
        }),
        get("name", HostedZoneId),
      ])(),
  findId: () =>
    pipe([
      get("HostedZoneId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchHostedZone", "DNSSECNotFound"],
  dependencies: {
    hostedZone: {
      type: "HostedZone",
      group: "Route53",
      parent: true,
      pathId: "HostedZoneId",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("HostedZoneId"),
          tap((HostedZoneId) => {
            assert(HostedZoneId);
          }),
        ]),
    },
    keySigningKeys: {
      type: "KeySigingKey",
      group: "Route53",
      list: true,
      dependencyIds:
        ({ lives, config }) =>
        ({ HostedZoneId, KeySigningKeys }) =>
          pipe([
            tap(() => {
              assert(HostedZoneId);
            }),
            () => KeySigningKeys,
            map(({ Name }) => `${HostedZoneId}::${Name}`),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDNSSEC-property
  getById: {
    method: "getDNSSEC",
    pickId: pipe([
      pick(["HostedZoneId"]),
      tap(({ HostedZoneId }) => {
        assert(HostedZoneId);
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listDNSSECs-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "HostedZone", group: "Route53" },
          pickKey: pipe([
            pick(["HostedZoneId"]),
            tap(({ HostedZoneId }) => {
              assert(HostedZoneId);
            }),
          ]),
          method: "getDNSSEC",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createDNSSEC-property
  create: {
    method: "enableHostedZoneDNSSEC",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status.ServeSignature"), isIn(["RUNNING"])]),
    isInstanceError: pipe([get("Status.ServeSignature"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("Status.StatusMessage", "FAILED")]),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => payload,
        switchCase([
          eq(get("Status.ServeSignature"), "SIGNING"),
          endpoint().enableHostedZoneDNSSEC,
          eq(get("Status.ServeSignature"), "NOT_SIGNING"),
          endpoint().disableHostedZoneDNSSEC,
          () => {
            assert(false, `SIGNING or NOT_SIGNING`);
          },
        ]),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteDNSSEC-property
  destroy: {
    method: "disableHostedZoneDNSSEC",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { hostedZone },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(hostedZone);
      }),
      () => otherProps,
      defaultsDeep({
        HostedZoneId: getField(hostedZone, "HostedZoneId"),
      }),
    ])(),
});
