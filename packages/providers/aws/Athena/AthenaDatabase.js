const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const toDatabaseName = ({ Name, ...other }) => ({
  DatabaseName: Name,
  ...other,
});

const pickId = pipe([
  tap(({ CatalogName, DatabaseName }) => {
    assert(DatabaseName);
    assert(CatalogName);
  }),
  pick(["CatalogName", "DatabaseName"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.Name);
    }),
    defaultsDeep({ CatalogName: live.Name }),
    toDatabaseName,
  ]);

const findName =
  () =>
  ({ CatalogName, DatabaseName }) =>
    pipe([
      tap((params) => {
        assert(CatalogName);
        assert(DatabaseName);
      }),
      () => `${CatalogName}::${DatabaseName}`,
    ])();

const filterPayload = pipe([
  tap((params) => {
    assert(true);
  }),
  ({ CatalogName, DatabaseName, ...other }) => ({
    QueryExecutionContext: { Catalog, Database },
    ...other,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html
exports.AthenaDatabase = () => ({
  type: "Database",
  package: "athena",
  client: "Athena",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { dataCatalog } }) =>
    ({ DatabaseName }) =>
      pipe([
        tap((params) => {
          assert(dataCatalog);
          assert(DatabaseName);
        }),
        () => `${dataCatalog}::${DatabaseName}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: ["InvalidRequestException"],
  dependencies: {
    dataCatalog: {
      type: "DataCatalog",
      group: "Athena",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("CatalogName")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("ResultConfiguration.EncryptionConfiguration.KmsKey"),
    },
    s3BucketOutput: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResultConfiguration.OutputLocation"),
          callProp("replace", "s3://", ""),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#getDatabase-property
  getById: {
    method: "getDatabase",
    getField: "Database",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#listDatabases-property
  getList: {
    method: "listDatabases",
    getParam: "DatabaseList",
    decorate: ({ getById }) => pipe([toDatabaseName, getById]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DataCatalog", group: "Athena" },
          pickKey: pipe([
            toDatabaseName,
            tap(({ CatalogName }) => {
              assert(CatalogName);
            }),
          ]),
          method: "listDatabases",
          getParam: "DatabaseList",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Name);
              }),
              defaultsDeep({ CatalogName: parent.Name }),
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#createDatabase-property
  create: {
    filterPayload,
    method: "startQueryExecution",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#updateDatabase-property
  update: {
    method: "startQueryExecution",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#deleteDatabase-property
  destroy: {
    method: "startQueryExecution",
    pickId: pipe([
      tap(({ DatabaseName }) => {
        assert(DatabaseName);
      }),
      ({ DatabaseName, ...other }) => ({
        QueryString: `drop database  ${DatabaseName} cascade`,
        ...other,
      }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { dataCatalog, kmsKey },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(dataCatalog);
      }),
      () => otherProps,
      defaultsDeep({
        CatalogName: dataCatalog.config.Name,
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          ResultConfiguration: {
            EncryptionConfiguration: {
              EncryptionConfiguration: getField(KmsKey, "Arn"),
            },
          },
        })
      ),
    ])(),
});
