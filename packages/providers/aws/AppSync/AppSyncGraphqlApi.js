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
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GraphqlApi" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.name");
const findId = get("live.apiId");
const pickParam = pick(["apiId"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncGraphqlApi = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live }) => [];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listGraphqlApis-property
  const getList = () =>
    pipe([() => ({}), appSync().listGraphqlApis, get("graphqlApis")])();

  const getByName = getByNameCore({ getList, findName });

  const getByLive = pipe([
    tap((live) => {
      assert(live.apiId);
    }),
    pickParam,
    tryCatch(appSync().getGraphqlApi, (error, params) =>
      pipe([
        tap(() => {
          logger.error(`error getGraphqlApi ${tos({ params, error })}`);
        }),
      ])()
    ),
  ]);

  const isUpByLive = pipe([getByLive, not(isEmpty)]);
  const isDownByLive = pipe([getByLive, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property
  const create = ({ payload, name }) =>
    pipe([
      () => payload,
      appSync().createGraphqlApi,
      get("graphqlApi"),
      tap(({ apiId }) =>
        retryCall({
          name: `createGraphqlApi isUpByLive: ${name}`,
          fn: () => isUpByLive({ apiId }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteGraphqlApi-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.apiId);
      }),
      () => live,
      pickParam,
      tryCatch(
        pipe([
          appSync().deleteGraphqlApi,
          () =>
            retryCall({
              name: `deleteGraphqlApi isDownByLive: ${live.name}`,
              fn: () => isDownByLive(live),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteGraphqlApi ${tos({ params, error })}`);
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

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([
      () => properties,
      defaultsDeep({
        name,
        tags: buildTagsObject({ config, namespace, name }),
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
