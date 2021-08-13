const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  pick,
  flatMap,
} = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ApiKey" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findName = get("live.name");
const findId = get("live.id");
const pickParam = pick(["id", "apiId"]);

const graphqlApiArn = ({ config, apiId }) =>
  `arn:aws:appsync:${
    config.region
  }:${config.accountId()}:apis/graphqlapiid/${apiId}`;

const buildTagKey = ({ id }) => `gc-api-key-${id}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncApiKey = ({ spec, config }) => {
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "GraphqlApi",
      group: "appSync",
      ids: [live.apiId],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listApiKeys-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "GraphqlApi",
          group: "appSync",
        }),
      pluck("id"),
      flatMap((apiId) =>
        tryCatch(
          pipe([
            () => appSync().listApiKeys({ apiId }),
            get("apiKeys"),
            map(defaultsDeep({ apiId })),
            map(
              assign({
                tags: ({ id }) =>
                  pipe([
                    () =>
                      appSync().listTagsForResource({
                        resourceArn: graphqlApiArn({
                          config,
                          apiId,
                        }),
                      }),
                    get("tags"),
                    assign({ name: get(buildTagKey({ id })) }),
                    omit([buildTagKey({ id })]),
                  ])(),
              })
            ),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(`error getList api key: ${tos({ apiId, error })}`);
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
      tap((apiKeys) => {
        logger.error(`getList api key ${tos({ error })}`);
      }),
      (items = []) => ({
        total: items.length,
        items,
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createApiKey-property
  const create = ({ payload, name, resolvedDependencies: { graphqlApi } }) =>
    pipe([
      tap(() => {
        assert(payload.id);
        assert(payload.apiId);
        assert(graphqlApi.live.tags);
      }),
      () => payload,
      appSync().createApiKey,
      pipe([
        ({ id }) => ({
          resourceArn: graphqlApiArn({
            config,
            apiId: payload.apiId,
          }),
          tags: { ...graphqlApi.live.tags, [buildTagKey({ id })]: name },
        }),
        appSync().tagResource,
      ]),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteApiKey-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.id);
        assert(live.apiId);
      }),
      () => live,
      pickParam,
      tryCatch(appSync().deleteApiKey, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error deleteApiKey ${tos({ params, error })}`);
          }),
          () => error,
          switchCase([
            eq(get("code"), "NotFoundException"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { graphqlApi },
  }) =>
    pipe([
      tap(() => {
        assert(graphqlApi, "missing 'graphqlApi' dependency");
      }),
      () => properties,
      defaultsDeep({
        apiId: getField(graphqlApi, "apiId"),
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
