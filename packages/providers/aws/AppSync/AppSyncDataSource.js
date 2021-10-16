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
const { defaultsDeep, pluck, isEmpty, prepend } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "DataSource" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const findId = get("live.dataSourceArn");
const findName = get("live.name");

const pickParam = pick(["apiId", "name"]);

const graphqlApiArn = ({ config, apiId }) =>
  `arn:aws:appsync:${config.region}:${config.accountId()}:apis/${apiId}`;

const buildTagKey = pipe([
  get("name"),
  tap((name) => {
    assert(name);
  }),
  prepend("gc-data-source-"),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncDataSource = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "GraphqlApi",
      group: "AppSync",
      ids: [live.apiId],
    },
    {
      type: "Role",
      group: "IAM",
      ids: [live.serviceRoleArn],
    },
    {
      type: "Function",
      group: "Lambda",
      ids: [get("lambdaConfig.lambdaFunctionArn")(live)],
    },
    {
      type: "DBCluster",
      group: "RDS",
      ids: [
        get(
          "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier"
        )(live),
      ],
    },
    {
      type: "Table",
      group: "DynamoDB",
      ids: [
        pipe([
          () => live,
          get("dynamodbConfig.tableName"),
          (name) =>
            lives.getByName({
              name,
              type: "Table",
              group: "DynamoDB",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listDataSources-property
  const getList = ({ lives }) =>
    pipe([
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
            () => appSync().listDataSources({ apiId }),
            get("dataSources"),
            map(defaultsDeep({ apiId })),
            map(
              assign({
                tags: ({ name }) =>
                  pipe([
                    () => ({
                      resourceArn: graphqlApiArn({
                        config,
                        apiId,
                      }),
                    }),
                    appSync().listTagsForResource,
                    get("tags"),
                    assign({ name: get(buildTagKey({ name })) }),
                    omit([buildTagKey({ name })]),
                  ])(),
              })
            ),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(
                  `error getList data source: ${tos({ apiId, error })}`
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getDataSource-property
  const getById = pipe([
    tap(({ name, apiId }) => {
      assert(name);
      assert(apiId);
    }),
    appSync().getDataSource,
    get("dataSource"),
  ]);

  const isUpById = pipe([getById, not(isEmpty)]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createDataSource-property
  const create = ({ payload, name, resolvedDependencies: { graphqlApi } }) =>
    pipe([
      tap(() => {
        assert(payload.apiId);
        assert(graphqlApi.live.tags);
        logger.debug(
          `create dataSource, graphqlApi tags ${tos(graphqlApi.live.tags)}`
        );
      }),
      () => payload,
      appSync().createDataSource,
      get("dataSource"),
      tap(() =>
        retryCall({
          name: `dataSource isUpById: ${name}`,
          fn: () => isUpById({ name, apiId: payload.apiId }),
        })
      ),
      tap((params) => {
        assert(true);
      }),
      pipe([
        ({ name }) => ({
          resourceArn: graphqlApiArn({
            config,
            apiId: payload.apiId,
          }),
          tags: { ...graphqlApi.live.tags, [buildTagKey({ name })]: name },
        }),
        appSync().tagResource,
      ]),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteDataSource-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.name);
        assert(live.apiId);
      }),
      () => live,
      pickParam,
      tryCatch(appSync().deleteDataSource, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error deleteDataSource ${tos({ params, error })}`);
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
    dependencies: { graphqlApi, serviceRole, lambdaFunction },
  }) =>
    pipe([
      tap(() => {
        assert(graphqlApi, "missing 'graphqlApi' dependency");
        assert(serviceRole, "missing 'serviceRole' dependency");
      }),
      () => properties,
      tap.if(eq(get("type"), "AWS_LAMBDA"), () => {
        assert(lambdaFunction, "missing 'lambdaFunction'");
      }),
      defaultsDeep({
        name,
        apiId: getField(graphqlApi, "apiId"),
        serviceRoleArn: getField(serviceRole, "Arn"),
        ...(lambdaFunction && {
          lambdaConfig: {
            lambdaFunctionArn: getField(lambdaFunction, "FunctionArn"),
          },
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
