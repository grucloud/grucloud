const assert = require("assert");
const { pipe, tap, get, set, pick, flatMap, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ConfigServiceCommon");

const buildArn = () =>
  pipe([
    get("ConfigurationAggregatorArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ConfigurationAggregatorName }) => {
    assert(ConfigurationAggregatorName);
  }),
  pick(["ConfigurationAggregatorName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

//TODO
//   const managedByOther = () =>
//   pipe([
//     or([
//       eq(get("Source.Owner"), "AWS"),
//       eq(get("CreatedBy"), "securityhub.amazonaws.com"),
//     ]),
//   ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html
exports.ConfigConfigurationAggregator = () => ({
  type: "ConfigurationAggregator",
  package: "config-service",
  client: "ConfigService",
  propertiesDefault: {},
  omitProperties: [
    "ConfigurationAggregatorArn",
    "CreationTime",
    "LastUpdatedTime",
    "CreatedBy",
    "AccountAggregationSources.AccountIds",
  ],
  inferName: () =>
    pipe([
      get("ConfigurationAggregatorName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ConfigurationAggregatorName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ConfigurationAggregatorArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchConfigurationAggregatorException"],
  dependencies: {
    accounts: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AccountAggregationSources"), flatMap(get("AccountIds"))]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: () => pipe([get("OrganizationAggregationSource.RoleArn")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      set(
        "OrganizationAggregationSource.RoleArn",
        pipe([
          get("OrganizationAggregationSource.RoleArn"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ])
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConfigurationAggregators-property
  getById: {
    method: "describeConfigurationAggregators",
    getField: "ConfigurationAggregators",
    pickId: pipe([
      tap(({ ConfigurationAggregatorName }) => {
        assert(ConfigurationAggregatorName);
      }),
      ({ ConfigurationAggregatorName }) => ({
        ConfigurationAggregatorNames: [ConfigurationAggregatorName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConfigurationAggregators-property
  getList: {
    method: "describeConfigurationAggregators",
    getParam: "ConfigurationAggregators",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putConfigurationAggregator-property
  create: {
    method: "putConfigurationAggregator",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putConfigurationAggregator-property
  update: {
    method: "putConfigurationAggregator",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteConfigurationAggregator-property
  destroy: {
    method: "deleteConfigurationAggregator",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { accounts, iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => accounts,
        defaultsDeep({
          AccountAggregationSources: {
            AccountIds: pipe([
              () => accounts,
              map((account) => getField(account, "Id")),
            ])(),
          },
        })
      ),
      when(
        () => iamRole,
        defaultsDeep({
          OrganizationAggregationSource: {
            RoleArn: getField(iamRole, "Arn"),
          },
        })
      ),
    ])(),
});
