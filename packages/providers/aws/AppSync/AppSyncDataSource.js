const assert = require("assert");
const { pipe, tap, get, set, eq, pick, assign } = require("rubico");
const { defaultsDeep, when, find } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { replaceRegion } = require("../AwsCommon");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { Tagger, ignoreErrorCodes } = require("./AppSyncCommon");

const { findDependenciesGraphqlId } = require("./AppSyncCommon");

const buildArn = () =>
  pipe([
    get("dataSourceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () => get("dataSourceArn");

const findName = () =>
  pipe([
    get("name"),
    tap((name) => {
      assert(name);
    }),
  ]);

const pickId = pipe([
  tap(({ apiId, name }) => {
    assert(apiId);
    assert(name);
  }),
  pick(["apiId", "name"]),
]);

const setAwsRegion = ({ providerConfig, path }) =>
  when(
    get(path),
    set(path, pipe([get(path), replaceRegion({ providerConfig })]))
  );

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.apiId);
    }),
    defaultsDeep({ apiId: live.apiId }),
    omitIfEmpty([
      "description",
      "dynamodbConfig",
      "elasticsearchConfig",
      "openSearchServiceConfig",
      "httpConfig",
      "relationalDatabaseConfig",
      "eventBridgeConfig",
    ]),
    JSON.stringify,
    JSON.parse,
  ]);

exports.AppSyncDataSource = ({ compare }) => ({
  type: "DataSource",
  package: "appsync",
  client: "AppSync",
  propertiesDefault: {},
  omitProperties: [
    "apiId",
    "serviceRoleArn",
    "dataSourceArn",
    "eventBridgeConfig.eventBusArn",
    "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier",
    "relationalDatabaseConfig.rdsHttpEndpointConfig.awsSecretStoreArn",
    "lambdaConfig",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName,
  findId,
  filterLive: ({ providerConfig }) =>
    pipe([
      setAwsRegion({ path: "dynamodbConfig.awsRegion", providerConfig }),
      setAwsRegion({
        path: "elasticsearchConfig.awsRegion",
        providerConfig,
      }),
      setAwsRegion({
        path: "openSearchServiceConfig.awsRegion",
        providerConfig,
      }),
      setAwsRegion({
        path: "relationalDatabaseConfig.rdsHttpEndpointConfig.awsRegion",
        providerConfig,
      }),
      when(
        get("httpConfig"),
        assign({
          httpConfig: pipe([
            get("httpConfig"),
            when(
              get("endpoint"),
              assign({
                authorizationConfig: pipe([
                  get(["authorizationConfig"]),
                  assign({
                    awsIamConfig: pipe([
                      get("awsIamConfig"),
                      assign({
                        signingRegion: pipe([
                          get("signingRegion"),
                          replaceRegion({ providerConfig }),
                        ]),
                      }),
                    ]),
                  }),
                ]),
                endpoint: pipe([
                  get("endpoint"),
                  replaceRegion({ providerConfig }),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  dependencies: {
    graphqlApi: {
      type: "GraphqlApi",
      group: "AppSync",
      parent: true,
      dependencyId: findDependenciesGraphqlId,
    },
    serviceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("serviceRoleArn"),
    },
    dbCluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: ({ lives, config }) =>
        get(
          "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier"
        ),
    },
    eventBus: {
      type: "EventBus",
      group: "CloudWatchEvents",
      dependencyId: () => pipe([get("eventBridgeConfig.eventBusArn")]),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) =>
        get("lambdaConfig.lambdaFunctionArn"),
    },
    dynamoDbTable: {
      type: "Table",
      group: "DynamoDB",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("dynamodbConfig.tableName"),
          lives.getByName({
            type: "Table",
            group: "DynamoDB",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    openSearchDomain: {
      type: "Domain",
      group: "OpenSearch",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("openSearchServiceConfig.endpoint"),
          (endpoint) =>
            pipe([
              lives.getByType({
                type: "Domain",
                group: "OpenSearch",
                providerName: config.providerName,
              }),
              find(eq(get("live.Endpoint"), endpoint)),
              get("id"),
            ])(),
        ]),
    },
    secretsManagerSecretRDS: {
      type: "Secret",
      group: "SecretsManager",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "relationalDatabaseConfig.rdsHttpEndpointConfig.awsSecretStoreArn"
          ),
        ]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getDataSource-property
  getById: {
    pickId,
    method: "getDataSource",
    getField: "dataSource",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listDataSources-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GraphqlApi", group: "AppSync" },
          pickKey: pick(["apiId"]),
          method: "listDataSources",
          getParam: "dataSources",
          config,
          decorate: ({ lives, parent }) =>
            pipe([
              defaultsDeep({ apiId: parent.apiId }),
              decorate({ config, live: parent }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createDataSource-property
  create: {
    pickCreated: ({ payload: { apiId } }) =>
      pipe([get("dataSource"), defaultsDeep({ apiId })]),
    method: "createDataSource",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#updateDataSource-property
  update: {
    method: "updateDataSource",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteDataSource-property
  destroy: {
    pickId,
    method: "deleteDataSource",
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
    properties,
    dependencies: {
      eventBus,
      graphqlApi,
      openSearchDomain,
      serviceRole,
      lambdaFunction,
      secretsManagerSecretRDS,
    },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(graphqlApi, "missing 'graphqlApi' dependency");
      }),
      () => properties,
      tap.if(eq(get("type"), "AWS_LAMBDA"), () => {
        assert(lambdaFunction, "missing 'lambdaFunction'");
      }),
      defaultsDeep({
        name,
        apiId: getField(graphqlApi, "apiId"),
      }),
      when(
        () => eventBus,
        defaultsDeep({
          eventBridgeConfig: {
            eventBusArn: getField(eventBus, "Arn"),
          },
        })
      ),
      when(
        () => lambdaFunction,
        defaultsDeep({
          lambdaConfig: {
            lambdaFunctionArn: getField(
              lambdaFunction,
              "Configuration.FunctionArn"
            ),
          },
        })
      ),
      when(
        () => openSearchDomain,
        defaultsDeep({
          openSearchServiceConfig: {
            endpoint: getField(openSearchDomain, "Endpoint"),
          },
        })
      ),
      when(
        () => secretsManagerSecretRDS,
        defaultsDeep({
          relationalDatabaseConfig: {
            rdsHttpEndpointConfig: {
              awsSecretStoreArn: getField(secretsManagerSecretRDS, "ARN"),
            },
          },
        })
      ),
      when(
        () => serviceRole,
        defaultsDeep({ serviceRoleArn: getField(serviceRole, "Arn") })
      ),
    ])(),
});
