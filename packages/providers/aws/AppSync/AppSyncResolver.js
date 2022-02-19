const assert = require("assert");
const { map, pipe, tap, tryCatch, get, eq, pick, flatMap } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AppSyncResolver" });
const { tos } = require("@grucloud/core/tos");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const findId = get("live.resolverArn");

const findName = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  ({ typeName, fieldName }) => `resolver::${typeName}::${fieldName}`,
  tap((params) => {
    assert(true);
  }),
]);

const pickId = pick(["apiId", "fieldName", "typeName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncResolver = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "GraphqlApi",
      group: "AppSync",
      ids: [live.apiId],
    },
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

  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "GraphqlApi",
          group: "AppSync",
        }),
      pluck("live"),
      flatMap(({ apiId, tags }) =>
        tryCatch(
          pipe([
            tap(() => {
              assert(apiId);
            }),
            () => ({ apiId, format: "SDL" }),
            appSync().listTypes,
            get("types"),
            flatMap(({ name }) =>
              pipe([
                () => ({ apiId, typeName: name }),
                appSync().listResolvers,
                get("resolvers"),
                map(pipe([defaultsDeep({ apiId, tags })])),
              ])()
            ),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(
                  `error getList listResolvers: ${tos({ apiId, error })}`
                );
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getResolver-property
  const getById = client.getById({
    pickId,
    method: "getResolver",
    getField: "resolver",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createResolver-property
  const create = client.create({
    method: "createResolver",
    getById,
    pickId,
    config,
    shouldRetryOnException: pipe([
      tap((params) => {
        assert(true);
      }),
      eq(get("error.code"), "ConcurrentModificationException"),
    ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteResolver-property
  const destroy = client.destroy({
    pickId,
    method: "deleteResolver",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
    config,
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
    shouldRetryOnException,
  };
};
