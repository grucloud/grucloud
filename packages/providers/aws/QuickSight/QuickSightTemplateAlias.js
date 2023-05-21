const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ AwsAccountId, TemplateId, AliasName }) => {
    assert(AwsAccountId);
    assert(TemplateId);
    assert(AliasName);
  }),
  pick(["AwsAccountId", "TemplateId", "AliasName"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.TemplateId);
      assert(config);
    }),
    defaultsDeep({
      AwsAccountId: config.accountId(),
      TemplateId: live.TemplateId,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightTemplateAlias = () => ({
  type: "TemplateAlias",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["TemplateId", "Arn"],
  inferName:
    ({ dependenciesSpec: { template } }) =>
    ({ AliasName }) =>
      pipe([
        tap(() => {
          assert(template);
          assert(AliasName);
        }),
        () => `${template}::${AliasName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ AliasName, TemplateId }) =>
      pipe([
        () => TemplateId,
        lives.getById({
          type: "Template",
          group: "QuickSight",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${AliasName}`),
      ])(),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {
    template: {
      type: "Template",
      group: "QuickSight",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TemplateId"),
          tap((TemplateId) => {
            assert(TemplateId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeTemplateAlias-property
  getById: {
    method: "describeTemplateAlias",
    getField: "DescribeTemplateAliasResponse",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listTemplateAliases-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Template", group: "QuickSight" },
          pickKey: pipe([
            pick(["TemplateId"]),
            tap(({ TemplateId }) => {
              assert(TemplateId);
            }),
          ]),
          method: "listTemplateAliases",
          getParam: "TemplateAliasList",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.TemplateId);
              }),
              defaultsDeep({
                AwsAccountId: config.accountId(),
                TemplateId: parent.TemplateId,
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createTemplateAlias-property
  create: {
    method: "createTemplateAlias",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateTemplateAlias-property
  update: {
    method: "updateTemplateAlias",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteTemplateAlias-property
  destroy: {
    method: "deleteTemplateAlias",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { template },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(template);
      }),
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        TemplateId: getField(template, "TemplateId"),
      }),
    ])(),
});
