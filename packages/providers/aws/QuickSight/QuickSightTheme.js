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
  tap(({ ThemeId, AwsAccountId }) => {
    assert(ThemeId);
    assert(AwsAccountId);
  }),
  pick(["ThemeId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightTheme = () => ({
  type: "Theme",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["Arn", "CreatedTime", "LastUpdatedTime"],
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
      get("ThemeId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeTheme-property
  getById: {
    method: "describeTheme",
    getField: "Theme",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listThemes-property
  getList: {
    ignoreErrorCodes: ["UnsupportedUserEditionException"],
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listThemes",
    getParam: "Themes",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createTheme-property
  create: {
    method: "createTheme",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateTheme-property
  update: {
    method: "updateTheme",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteTheme-property
  destroy: {
    method: "deleteTheme",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
