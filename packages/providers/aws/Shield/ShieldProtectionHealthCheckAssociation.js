const assert = require("assert");
const { pipe, tap, get, pick, map, fork, flatMap } = require("rubico");
const {
  defaultsDeep,
  prepend,
  find,
  unless,
  isEmpty,
  includes,
  callProp,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ProtectionId, HealthCheckArn }) => {
    assert(ProtectionId);
    assert(HealthCheckArn);
  }),
  pick(["ProtectionId", "HealthCheckArn"]),
]);

const healthCheckIdToArn = prepend("arn:aws:route53:::healthcheck/");

const healthCheckArnToId = callProp(
  "replace",
  "arn:aws:route53:::healthcheck/",
  ""
);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      fork({
        protection: pipe([
          get("ProtectionId"),
          lives.getById({
            type: "Protection",
            group: "Shield",
            providerName: config.providerName,
          }),
          get("name", live.ProtectionId),
        ]),
        route53HealthCheck: pipe([
          get("HealthCheckArn"),
          healthCheckArnToId,
          lives.getById({
            type: "HealthCheck",
            group: "Route53",
            providerName: config.providerName,
          }),
          get("name", live.HealthCheckArn),
        ]),
      }),
      ({ protection, route53HealthCheck }) =>
        `${protection}::${route53HealthCheck}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html
exports.ShieldProtectionHealthCheckAssociation = () => ({
  type: "ProtectionHealthCheckAssociation",
  package: "shield",
  client: "Shield",
  propertiesDefault: {},
  omitProperties: ["ProtectionId", "HealthCheckArn"],
  inferName:
    ({ dependenciesSpec: { protection, route53HealthCheck } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(protection);
          assert(route53HealthCheck);
        }),
        () => `${protection}::${route53HealthCheck}`,
      ])(),
  findName,
  findId: findName,
  dependencies: {
    protection: {
      type: "Protection",
      group: "Shield",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ProtectionId"),
          tap((ProtectionId) => {
            assert(ProtectionId);
          }),
        ]),
    },
    route53HealthCheck: {
      type: "HealthCheck",
      group: "Route53HealthCheck",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("HealthCheckArn"),
          healthCheckArnToId,
          tap((HealthCheckArn) => {
            assert(HealthCheckArn);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#describeProtection-property
  getById: {
    method: "describeProtection",
    pickId,
    getField: "Protection",
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.ProtectionId);
          assert(live.HealthCheckArn);
        }),
        get("HealthCheckIds"),
        find(pipe([healthCheckIdToArn, includes(live.HealthCheckArn)])),
        unless(
          isEmpty,
          pipe([
            healthCheckIdToArn,
            (HealthCheckArn) => ({
              HealthCheckArn,
              ProtectionId: live.ProtectionId,
            }),
          ])
        ),
      ]),
  },
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives, config }) =>
      pipe([
        tap(() => {
          assert(config);
        }),
        lives.getByType({
          type: "Protection",
          group: "Shield",
          providerName: config.providerName,
        }),
        flatMap(
          pipe([
            get("live"),
            tap(({ ProtectionId }) => {
              assert(ProtectionId);
            }),
            ({ ProtectionId, HealthCheckIds }) =>
              pipe([
                () => HealthCheckIds,
                map(
                  pipe([
                    healthCheckIdToArn,
                    (HealthCheckArn) => ({ HealthCheckArn, ProtectionId }),
                  ])
                ),
              ])(),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#associateHealthCheck-property
  create: {
    method: "associateHealthCheck",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#disassociateHealthCheck-property
  destroy: {
    method: "disassociateHealthCheck",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { protection, route53HealthCheck },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(protection);
        assert(route53HealthCheck);
      }),
      () => otherProps,
      defaultsDeep({
        ProtectionId: getField(protection, "ProtectionId"),
        HealthCheckArn: getField(route53HealthCheck, "Arn"),
      }),
    ])(),
});
