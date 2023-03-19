const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
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
  tap(({ TemplateId, AwsAccountId }) => {
    assert(TemplateId);
    assert(AwsAccountId);
  }),
  pick(["TemplateId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightTemplate = () => ({
  type: "Template",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreatedTime",
    "LastUpdatedTime",
    "Version",
    "AwsAccountId",
  ],
  inferName: () =>
    pipe([
      get("TemplateId"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("TemplateId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("TemplateId"),
      tap((id) => {
        assert(id);
      }),
    ]),

  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeTemplate-property
  getById: {
    method: "describeTemplate",
    getField: "Template",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listTemplates-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listTemplates",
    getParam: "Templates",
    decorate,
    ignoreErrorCodes: ["UnsupportedUserEditionException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createTemplate-property
  create: {
    method: "createTemplate",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateTemplate-property
  update: {
    method: "updateTemplate",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteTemplate-property
  destroy: {
    method: "deleteTemplate",
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
