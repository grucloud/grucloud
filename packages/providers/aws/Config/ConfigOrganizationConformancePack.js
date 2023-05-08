const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  conformancePackdependencies,
  conformanceDecorate,
  conformanceCreate,
} = require("./ConfigServiceCommon");

const buildArn = () =>
  pipe([
    get("OrganizationConformancePackArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ OrganizationConformancePackName }) => {
    assert(OrganizationConformancePackName);
  }),
  pick(["OrganizationConformancePackName"]),
]);

const decorate = conformanceDecorate({
  describeConformancePackStatus: "describeOrganizationConformancePackStatus",
  ConformancePackStatusDetails: "OrganizationConformancePackStatuses",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html
exports.ConfigOrganizationConformancePack = () => ({
  type: "OrganizationConformancePack",
  package: "config-service",
  client: "ConfigService",
  propertiesDefault: {},
  omitProperties: [
    "OrganizationConformancePackArn",
    "ExcludedAccounts",
    "LastUpdateTime",
  ],
  inferName: () =>
    pipe([
      get("OrganizationConformancePackName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("OrganizationConformancePackName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("OrganizationConformancePackArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchOrganizationConformancePackException"],
  dependencies: {
    accountsExcluded: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("ExcludedAccounts")]),
    },
    ...conformancePackdependencies,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeOrganizationConformancePacks-property
  getById: {
    method: "describeOrganizationConformancePacks",
    getField: "OrganizationConformancePack",
    pickId: pipe([
      tap(({ OrganizationConformancePackName }) => {
        assert(OrganizationConformancePackName);
      }),
      ({ OrganizationConformancePackName }) => ({
        OrganizationConformancePackNames: [OrganizationConformancePackName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeOrganizationConformancePacks-property
  getList: {
    method: "describeOrganizationConformancePacks",
    getParam: "OrganizationConformancePacks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putOrganizationConformancePack-property
  create: conformanceCreate({
    putConformancePack: "putOrganizationConformancePack",
  }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#updateOrganizationConformancePack-property
  update: {
    method: "putOrganizationConformancePack",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteOrganizationConformancePack-property
  destroy: {
    method: "deleteOrganizationConformancePack",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { accountsExcluded },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => accountsExcluded,
        defaultsDeep({
          ExcludedAccounts: pipe([
            () => accountsExcluded,
            map((account) => getField(account, "Id")),
          ])(),
        })
      ),
    ])(),
});
