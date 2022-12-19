const assert = require("assert");
const { pipe, tap, get, pick, eq, omit, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { findDependenciesGraphqlId } = require("./AppSyncCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./AppSyncCommon");

const buildArn = () =>
  pipe([
    get("resolverArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pick(["apiId", "fieldName", "typeName"]);

const decorate = ({ live }) => pipe([defaultsDeep({ apiId: live.apiId })]);

const findId = () => get("resolverArn");

const findName = () =>
  pipe([
    tap(({ typeName, fieldName }) => {
      assert(typeName);
      assert(fieldName);
    }),
    ({ typeName, fieldName }) => `resolver::${typeName}::${fieldName}`,
  ]);

const filterPayload = pipe([
  tap((params) => {
    assert(true);
  }),
]);

const omitMaxBatchSize = when(
  eq(get("maxBatchSize"), 0),
  omit(["maxBatchSize"])
);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncResolver = ({ compare }) => ({
  type: "Resolver",
  package: "appsync",
  client: "AppSync",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "resolverArn",
    "apiId",
    "dataSourceName",
    "pipelineConfig",
  ],
  inferName:
    () =>
    ({ typeName, fieldName }) =>
      pipe([
        tap((params) => {
          assert(typeName);
          assert(fieldName);
        }),
        () => `resolver::${typeName}::${fieldName}`,
      ])(),
  findName,
  findId,
  dependencies: {
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
    graphqlApi: {
      type: "GraphqlApi",
      group: "AppSync",
      parent: true,
      dependencyId: findDependenciesGraphqlId,
    },
    functions: {
      type: "Function",
      group: "AppSync",
      list: true,
      dependencyIds: ({ lives, config }) => get("pipelineConfig.functions"),
    },
    type: {
      type: "Type",
      group: "AppSync",
      dependencyId: ({ lives, config }) => get("typeName"),
    },
  },
  compare: compare({
    filterLive: () =>
      pipe([
        // TODO replace region
        omitIfEmpty([
          "description",
          "requestMappingTemplate",
          "responseMappingTemplate",
        ]),
        omitMaxBatchSize,
      ]),
  }),
  filterLive: () => pipe([omitMaxBatchSize]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getFunction-property
  getById: {
    pickId,
    method: "getResolver",
    getField: "resolver",
    ignoreErrorCodes,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listFunctions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GraphqlApi", group: "AppSync" },
          pickKey: pipe([pick(["apiId"]), defaultsDeep({ format: "SDL" })]),
          method: "listTypes",
          getParam: "types",
          config,
          decorate: ({ parent: { apiId, tags } }) =>
            pipe([
              ({ name }) =>
                pipe([
                  () => ({ apiId, typeName: name }),
                  endpoint().listResolvers,
                  get("resolvers"),
                  map(pipe([defaultsDeep({ apiId }), getById({})])),
                ])(),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createFunction-property
  create: {
    method: "createResolver",
    filterPayload,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    shouldRetryOnExceptionCodes: ["ConcurrentModificationException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#updateResolver-property
  update: {
    method: "updateResolver",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(true);
        }),
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteFunction-property
  destroy: {
    pickId,
    method: "deleteResolver",
    ignoreErrorCodes,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { graphqlApi, dataSource, functions },
  }) =>
    pipe([
      tap(() => {
        assert(graphqlApi, "missing 'graphqlApi' dependency");
        //assert(dataSource, "missing 'dataSource' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        apiId: getField(graphqlApi, "apiId"),
      }),
      when(
        () => dataSource,
        defaultsDeep({
          dataSourceName: getField(dataSource, "name"),
        })
      ),
      when(
        () => functions,
        defaultsDeep({
          pipelineConfig: {
            functions: pipe([
              () => functions,
              map((fun) => getField(fun, "functionId")),
            ])(),
          },
        })
      ),
    ])(),
});
