const assert = require("assert");
const { map, pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const {
  createAppSync,
  findDependenciesGraphqlApi,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./AppSyncCommon");

const findId = get("live.resolverArn");

const findName = pipe([
  get("live"),
  ({ typeName, fieldName }) => `resolver::${typeName}::${fieldName}`,
]);

const pickId = pick(["apiId", "fieldName", "typeName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncResolver = ({ spec, config }) => {
  const appSync = createAppSync(config);

  const client = AwsClient({ spec, config })(appSync);

  // findDependencies for AppSyncResolver
  const findDependencies = ({ live, lives }) => [
    findDependenciesGraphqlApi({ live }),
    {
      type: "Type",
      group: "AppSync",
      ids: [live.typeName],
    },
    {
      type: "DataSource",
      group: "AppSync",
      ids: [
        pipe([
          () =>
            lives.getByName({
              name: live.dataSourceName,
              type: "DataSource",
              group: "AppSync",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
  ];

  const findNamespace = pipe([() => ""]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listResolvers-property
  const getList = client.getListWithParent({
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
            appSync().listResolvers,
            get("resolvers"),
            map(pipe([defaultsDeep({ apiId, tags })])),
          ])(),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getResolver-property
  const getById = client.getById({
    pickId,
    method: "getResolver",
    getField: "resolver",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createResolver-property
  const create = client.create({
    method: "createResolver",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
    shouldRetryOnExceptionCodes: ["ConcurrentModificationException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteResolver-property
  const destroy = client.destroy({
    pickId,
    method: "deleteResolver",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { graphqlApi, dataSource },
  }) =>
    pipe([
      tap(() => {
        assert(graphqlApi, "missing 'graphqlApi' dependency");
        assert(dataSource, "missing 'dataSource' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        apiId: getField(graphqlApi, "apiId"),
        // TODO optional or not ?
        ...(dataSource && {
          dataSourceName: getField(dataSource, "name"),
        }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ appSync }),
    untagResource: untagResource({ appSync }),
  };
};
