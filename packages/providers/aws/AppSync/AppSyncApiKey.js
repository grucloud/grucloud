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
  assign,
  omit,
} = require("rubico");
const { find, defaultsDeep, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ApiKey" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.id");
const findName = findNameInTagsOrId({ findId, tags: "tags" });

const pickParam = pick(["id", "apiId"]);

const graphqlApiArn = ({ config, apiId }) =>
  `arn:aws:appsync:${config.region}:${config.accountId()}:apis/${apiId}`;

const buildTagKey = ({ id }) => `gc-api-key-${id}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncApiKey = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "GraphqlApi",
      group: "AppSync",
      ids: [live.apiId],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listApiKeys-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "GraphqlApi",
          group: "AppSync",
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
                    () => ({
                      resourceArn: graphqlApiArn({
                        config,
                        apiId,
                      }),
                    }),
                    tap((params) => {
                      assert(true);
                    }),
                    appSync().listTagsForResource,
                    get("tags"),
                    assign({ Name: get(buildTagKey({ id })) }),
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
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listApiKeys-property
  const getById = ({ apiId, id }) =>
    pipe([
      tap(() => {
        assert(id);
        assert(apiId);
      }),
      () => ({ apiId }),
      appSync().listApiKeys,
      get("apiKeys"),
      find(eq(get("id"), id)),
    ])();

  const isUpById = pipe([getById, not(isEmpty)]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createApiKey-property
  const create = ({ payload, name, resolvedDependencies: { graphqlApi } }) =>
    pipe([
      tap(() => {
        assert(payload.apiId);
        //assert(graphqlApi.live.tags);
      }),
      () => payload,
      appSync().createApiKey,
      get("apiKey"),
      tap(({ id }) =>
        retryCall({
          name: `apiKey isUpByName: ${name}`,
          fn: () => isUpById({ id, apiId: payload.apiId }),
        })
      ),
      ({ id }) => ({
        resourceArn: graphqlApiArn({
          config,
          apiId: payload.apiId,
        }),
        tags: { ...graphqlApi.live.tags, [buildTagKey({ id })]: name },
      }),
      appSync().tagResource,
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
