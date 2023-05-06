const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ DatabaseName, PartitionValues, TableName, CatalogId }) => {
    assert(DatabaseName);
    assert(PartitionValues);
    assert(TableName);
  }),
  pick(["DatabaseName", "PartitionValues", "TableName", "CatalogId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const findName =
  () =>
  ({ DatabaseName, TableName }) =>
    pipe([
      tap(() => {
        assert(DatabaseName);
        assert(TableName);
      }),
      () => `${DatabaseName}::${TableName}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GluePartition = () => ({
  type: "Partition",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: [
    "DatabaseName",
    "TableName",
    "CatalogId",
    "CreationTime",
    "LastAccessTime",
    "LastAnalyzedTime",
  ],
  inferName:
    ({ dependenciesSpec: { database, table } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(database);
          assert(table);
        }),
        () => `${database}::${table}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: ["EntityNotFoundException", "InvalidInputException"],
  dependencies: {
    database: {
      type: "Database",
      group: "Glue",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DatabaseName"),
          tap((DatabaseName) => {
            assert(DatabaseName);
          }),
        ]),
    },
    table: {
      type: "Table",
      group: "Glue",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TableName"),
          tap((TableName) => {
            assert(TableName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getPartition-property
  getById: {
    method: "getPartition",
    getField: "Partition",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getPartitions-property
  getList: {
    method: "getPartitions",
    getParam: "Partitions",
    decorate: ({ getById }) => pipe([getById]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Table", group: "Glue" },
          pickKey: pipe([
            ({ DatabaseName, Name, CatalogId }) => ({
              DatabaseName,
              TableName: Name,
              CatalogId,
            }),
          ]),
          method: "getPartitions",
          getParam: "Partitions",
          config,
          decorate: () => pipe([decorate({ config })]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createPartition-property
  create: {
    method: "createPartition",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updatePartition-property
  update: {
    method: "updatePartition",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deletePartition-property
  destroy: {
    method: "deletePartition",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { database, table },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(database);
        assert(table);
      }),
      () => otherProps,
      defaultsDeep({
        DatabaseName: get("config.DatabaseName")(database),
        TableName: get("config.Name")(table),
      }),
    ])(),
});
