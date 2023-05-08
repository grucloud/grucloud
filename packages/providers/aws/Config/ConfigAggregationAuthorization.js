const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ConfigServiceCommon");

const buildArn = () =>
  pipe([
    get("AggregationAuthorizationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AuthorizedAccountId, AuthorizedAwsRegion }) => {
    assert(AuthorizedAccountId);
    assert(AuthorizedAwsRegion);
  }),
  pick(["AuthorizedAccountId", "AuthorizedAwsRegion"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

const findName =
  ({ lives, config }) =>
  ({ AuthorizedAwsRegion, AuthorizedAccountId }) =>
    pipe([
      tap((params) => {
        assert(AuthorizedAccountId);
        assert(AuthorizedAwsRegion);
      }),
      () => AuthorizedAccountId,
      lives.getById({
        type: "Account",
        group: "Organisations",
        providerName: config.providerName,
      }),
      get("name", AuthorizedAccountId),
      append(`::${AuthorizedAwsRegion}`),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html
exports.ConfigAggregationAuthorization = () => ({
  type: "AggregationAuthorization",
  package: "config-service",
  client: "ConfigService",
  propertiesDefault: {},
  omitProperties: [
    "AggregationAuthorizationArn",
    "AuthorizedAccountId",
    "CreationTime",
  ],
  inferName:
    ({ dependenciesSpec: { account } }) =>
    ({ AuthorizedAwsRegion }) =>
      pipe([
        tap((params) => {
          assert(account);
          assert(AuthorizedAwsRegion);
        }),
        () => `${account}::${AuthorizedAwsRegion}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AuthorizedAccountId"),
          tap((AuthorizedAccountId) => {
            assert(AuthorizedAccountId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeAggregationAuthorizations-property
  getById: {
    method: "describeAggregationAuthorizations",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap(() => {
          assert(live.AuthorizedAccountId);
        }),
        get("AggregationAuthorizations"),
        find(eq(get("AuthorizedAccountId", ""), live.AuthorizedAccountId)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeAggregationAuthorizations-property
  getList: {
    method: "describeAggregationAuthorizations",
    getParam: "AggregationAuthorizations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putAggregationAuthorization-property
  create: {
    method: "putAggregationAuthorization",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putAggregationAuthorization-property
  update: {
    method: "putAggregationAuthorization",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteAggregationAuthorization-property
  destroy: {
    method: "deleteAggregationAuthorization",
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
    dependencies: { account },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        AuthorizedAccountId: getField(account, "Id"),
      }),
    ])(),
});
