const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, omit } = require("rubico");
const { defaultsDeep, prepend } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { createEndpoint } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.dataSourceArn");
const findName = get("live.name");

const pickId = pipe([
  tap(({ apiId }) => {
    assert(apiId);
  }),
  pick(["apiId", "name"]),
]);

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

  const findNamespace = pipe([() => ""]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listDataSources-property

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listResolvers-property
  const getList = client.getListWithParent({
    parent: { type: "GraphqlApi", group: "AppSync" },
    pickKey: pick(["apiId"]),
    method: "listDataSources",
    getParam: "dataSources",
    config,
    decorate: ({ lives, parent: { apiId, Tags } }) =>
      pipe([
        tap((params) => {
          assert(apiId);
        }),
        defaultsDeep({ apiId, Tags }),
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
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getDataSource-property
  const getById = client.getById({
    pickId,
    method: "getDataSource",
    getField: "dataSource",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createDataSource-property
  const create = client.create({
    pickCreated: ({ payload: { apiId } }) =>
      pipe([
        tap((params) => {
          assert(apiId);
        }),
        get("dataSource"),
        defaultsDeep({ apiId }),
      ]),
    method: "createDataSource",
    getById,
    pickId,
    config,
    postCreate: ({ name, payload, resolvedDependencies: { graphqlApi } }) =>
      pipe([
        tap(({ apiId }) => {
          assert(apiId);
          assert(graphqlApi);
        }),
        ({ apiId }) => ({
          resourceArn: graphqlApiArn({
            config,
            apiId,
          }),
          tags: { ...graphqlApi.live.tags, [buildTagKey({ name })]: name },
        }),
        appSync().tagResource,
      ]),
  });

  const destroy = client.destroy({
    pickId,
    method: "deleteDataSource",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
    config,
  });

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
            lambdaFunctionArn: getField(
              lambdaFunction,
              "Configuration.FunctionArn"
            ),
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
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
