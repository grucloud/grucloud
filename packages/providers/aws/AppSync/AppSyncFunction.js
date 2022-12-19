const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { findDependenciesGraphqlId } = require("./AppSyncCommon");

const { Tagger } = require("./AppSyncCommon");

const buildArn = () =>
  pipe([
    get("functionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ apiId, functionId }) => {
    assert(apiId);
    assert(functionId);
  }),
  pick(["apiId", "functionId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.apiId);
    }),
    defaultsDeep({ apiId: live.apiId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncFunction = ({ compare }) => ({
  type: "Function",
  package: "appsync",
  client: "AppSync",
  propertiesDefault: {},
  omitProperties: ["apiId", "functionId", "functionArn"],
  inferName:
    ({ dependenciesSpec: { graphqlApi } }) =>
    ({ name }) =>
      pipe([
        tap(() => {
          assert(graphqlApi);
          assert(name);
        }),
        () => `${graphqlApi}::${name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ name, apiId }) =>
      pipe([
        lives.getByType({
          type: "GraphqlApi",
          group: "AppSync",
          providerName: config.providerName,
        }),
        find(eq(get("live.apiId"), apiId)),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${name}`),
      ])(),
  findId: () =>
    pipe([
      get("functionId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    graphqlApi: {
      type: "GraphqlApi",
      group: "AppSync",
      parent: true,
      dependencyId: findDependenciesGraphqlId,
    },
    dataSource: {
      type: "DataSource",
      group: "AppSync",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("dataSourceName"),
          lives.getByName({
            type: "DataSource",
            group: "AppSync",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getFunction-property
  getById: {
    method: "getFunction",
    getField: "functionConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listFunctions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GraphqlApi", group: "AppSync" },
          pickKey: pipe([pick(["apiId"])]),
          method: "listFunctions",
          getParam: "functions",
          config,
          decorate: ({ parent, endpoint }) =>
            pipe([decorate({ live: parent, endpoint })]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createFunction-property
  create: {
    method: "createFunction",
    pickCreated: ({ payload }) =>
      pipe([get("functionConfiguration"), defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#updateFunction-property
  update: {
    method: "updateFunction",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteFunction-property
  destroy: {
    method: "deleteFunction",
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
    dependencies: { graphqlApi, dataSource },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(graphqlApi);
        assert(dataSource);
      }),
      () => otherProps,
      defaultsDeep({
        apiId: getField(graphqlApi, "apiId"),
        dataSourceName: getField(dataSource, "name"),
      }),
    ])(),
});
