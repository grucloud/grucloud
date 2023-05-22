const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, and } = require("rubico");
const { defaultsDeep, find, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./CodePipelineCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ category, provider, version }) => {
    assert(category);
    assert(provider);
    assert(version);
  }),
  pick(["category", "provider", "version"]),
]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      arn: pipe([
        tap(({ category, provider, version }) => {
          assert(category);
          assert(provider);
          assert(version);
        }),
        ({ category, provider, version }) =>
          `arn:aws:codepipeline:${
            config.region
          }:${config.accountId()}:actiontype:Custom/${category}/${provider}/${version}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ id }) => {
      assert(id);
    }),
    ({ id, ...other }) => ({ ...id, ...other }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const findName =
  () =>
  ({ category, provider, version }) =>
    pipe([
      tap(({ category, provider, version }) => {
        assert(category);
        assert(provider);
        assert(version);
      }),
      () => `${category}::${provider}::${version}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html
exports.CodePipelineCustomActionType = () => ({
  type: "CustomActionType",
  package: "codepipeline",
  client: "CodePipeline",
  propertiesDefault: {},
  omitProperties: ["arn"],
  inferName: findName,
  findName,
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listActionTypes-property
  getById: {
    method: "listActionTypes",
    pickId,
    decorate: ({ live, endpoint, config }) =>
      pipe([
        get("actionTypes"),
        find(
          and([
            eq(get("id.category"), live.category),
            eq(get("id.provider"), live.provider),
            eq(get("id.version"), live.version),
          ])
        ),
        unless(isEmpty, pipe([decorate({ endpoint, config })])),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listActionTypes-property
  getList: {
    enhanceParams: () => () => ({ actionOwnerFilter: "Custom" }),
    method: "listActionTypes",
    getParam: "actionTypes",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#createCustomActionType-property
  create: {
    method: "createCustomActionType",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#updateActionType-property
  update: {
    method: "updateActionType",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#deleteCustomActionType-property
  destroy: {
    method: "deleteCustomActionType",
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
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
