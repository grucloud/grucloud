const assert = require("assert");
const { pipe, tap, get, pick, flatMap, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ usageLimitId }) => {
    assert(usageLimitId);
  }),
  pick(["usageLimitId"]),
]);

const decorate = ({}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html
exports.RedshiftServerlessUsageLimit = () => ({
  type: "UsageLimit",
  package: "redshift-serverless",
  client: "RedshiftServerless",
  propertiesDefault: {},
  omitProperties: ["usageLimitArn", "usageLimitId", "resourceArn"],
  inferName:
    ({ dependenciesSpec: { workgroup } }) =>
    ({ usageType }) =>
      pipe([
        tap((params) => {
          assert(workgroup);
          assert(usageType);
        }),
        () => `usage-limit::${workgroup}::${usageType}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.usageType);
        }),
        () => live,
        get("resourceArn"),
        tap((id) => {
          assert(id);
        }),
        (id) =>
          lives.getById({
            id,
            type: "Workgroup",
            group: "RedshiftServerless",
          }),
        get("name"),
        (workgroup) => `usage-limit::${workgroup}::${live.usageType}`,
      ])(),
  findId: () =>
    pipe([
      get("usageLimitArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    workgroup: {
      type: "Workgroup",
      group: "RedshiftServerless",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("resourceArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#getUsageLimit-property
  getById: {
    method: "getUsageLimit",
    getField: "usageLimit",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#listUsageLimits-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        () =>
          lives.getByType({
            type: "Workgroup",
            group: "RedshiftServerless",
            providerName: config.providerName,
          }),
        flatMap(({ live }) =>
          pipe([
            tap((params) => {
              assert(live.workgroupArn);
            }),
            () => ({
              resourceArn: live.workgroupArn,
            }),
            endpoint().listUsageLimits,
            get("usageLimits"),
          ])()
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#createUsageLimit-property
  create: {
    method: "createUsageLimit",
    pickCreated: ({ payload }) => pipe([get("usageLimit")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#updateUsageLimit-property
  update: {
    method: "updateUsageLimit",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#deleteUsageLimit-property
  destroy: {
    method: "deleteUsageLimit",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { workgroup },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(workgroup);
      }),
      () => otherProps,
      defaultsDeep({
        resourceArn: getField(workgroup, "workgroupArn"),
      }),
    ])(),
});
