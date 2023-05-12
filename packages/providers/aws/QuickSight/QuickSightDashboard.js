const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./QuickSightCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DashboardId, AwsAccountId }) => {
    assert(DashboardId);
    assert(AwsAccountId);
  }),
  pick(["DashboardId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightDashboard = () => ({
  type: "Dashboard",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "DashboardId",
    "CreatedTime",
    "LastPublishedTime",
    "LastUpdatedTime",
    "Version",
    "Status",
    "SecretArn",
    "AwsAccountId",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DashboardId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {
    // iamRole: {
    //   type: "Role",
    //   group: "IAM",
    //   dependsOnTypeOnly: true,
    //   dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    // },
    secretsManagerSecret: {
      type: "Secret",
      group: "SecretsManager",
      dependencyId: ({ lives, config }) => pipe([get("SecretArn")]),
    },
    template: {
      type: "Template",
      group: "QuickSight",
      dependencyIds: ({ lives, config }) => pipe([get("SourceTemplate")]),
    },
    theme: {
      type: "Theme",
      group: "QuickSight",
      dependencyIds: ({ lives, config }) => pipe([get("ThemeArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeDashboard-property
  getById: {
    method: "describeDashboard",
    getField: "Dashboard",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listDashboards-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listDashboards",
    getParam: "Dashboards",
    decorate,
    ignoreErrorCodes: ["UnsupportedUserEditionException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDashboard-property
  create: {
    method: "createDashboard",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateDashboard-property
  update: {
    method: "updateDashboard",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteDashboard-property
  destroy: {
    method: "deleteDashboard",
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
    dependencies: { secretsManagerSecret },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => secretsManagerSecret,
        defaultsDeep({
          SecretArn: getField(secretsManagerSecret, "ARN"),
        })
      ),
    ])(),
});
