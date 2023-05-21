const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const {
  defaultsDeep,
  find,
  append,
  isEmpty,
  unless,
  isIn,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ HostedZoneId, Name }) => {
    assert(HostedZoneId);
    assert(Name);
  }),
  pick(["HostedZoneId", "Name"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.HostedZoneId);
    }),
    defaultsDeep({ HostedZoneId: live.HostedZoneId }),
    ({ KmsArn, ...other }) => ({ KeyManagementServiceArn: KmsArn, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53KeySigningKey = () => ({
  type: "KeySigningKey",
  package: "route-53",
  client: "Route53",
  propertiesDefault: { Status: "ACTIVE" },
  omitProperties: [
    "StatusMessage",
    "CreatedDate",
    "LastModifiedDate",
    "Status",
    "DNSKEYRecord",
    "DSRecord",
    "PublicKey",
    "DigestValue",
    "KeyTag",
    "DigestAlgorithmType",
    "DigestAlgorithmMnemonic",
    "SigningAlgorithmType",
    "SigningAlgorithmMnemonic",
    "Flag",
    "CallerReference",
  ],
  inferName:
    ({ dependenciesSpec: { hostedZone } }) =>
    ({ Name }) =>
      pipe([
        tap((params) => {
          assert(hostedZone);
          assert(Name);
        }),
        () => `${hostedZone}::${Name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ Name, HostedZoneId }) =>
      pipe([
        tap((params) => {
          assert(HostedZoneId);
          assert(Name);
        }),
        () => HostedZoneId,
        lives.getById({
          type: "HostedZoneId",
          group: "Route53",
          providerName: config.providerName,
        }),
        get("name", HostedZoneId),
        append(`::${Name}`),
      ])(),
  findId:
    () =>
    ({ Name, HostedZoneId }) =>
      pipe([
        tap(() => {
          assert(HostedZoneId);
          assert(Name);
        }),
        () => `${HostedZoneId}::${Name}`,
      ])(),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      pathId: "KeyManagementServiceArn",
      dependencyId: ({ lives, config }) => get("KeyManagementServiceArn"),
    },
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
  },
  ignoreErrorCodes: ["NoSuchKeySigningKey"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDNSSEC-property
  getById: {
    method: "getDNSSEC",
    pickId: pipe([
      pick(["HostedZoneId"]),
      tap(({ HostedZoneId }) => {
        assert(HostedZoneId);
      }),
    ]),
    decorate: ({ config, endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live.Name);
          assert(live.HostedZoneId);
        }),
        get("KeySigningKeys"),
        find(eq(get("Name"), live.Name)),
        unless(isEmpty(decorate({ config, endpoint, live }))),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDNSSEC-property
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
          getParam: "KeySigningKeys",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createKeySigningKey-property
  create: {
    method: "createKeySigningKey",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([
      get("Status"),
      isIn(["ACTION_NEEDED", "INTERNAL_FAILURE"]),
    ]),
    getErrorMessage: pipe([get("StatusMessage", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#updateKeySigningKey-property
  //   update: {
  //     method: "updateKeySigningKey",
  //     filterParams: ({ payload, diff, live }) =>
  //       pipe([() => payload, defaultsDeep(pickId(live))])(),
  //   },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteKeySigningKey-property
  destroy: {
    method: "deleteKeySigningKey",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { hostedZone, kmsKey },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(hostedZone);
        assert(kmsKey);
      }),
      () => otherProps,
      defaultsDeep({
        HostedZoneId: getField(hostedZone, "HostedZoneId"),
        KeyManagementServiceArn: getField(kmsKey, "Arn"),
      }),
    ])(),
});
