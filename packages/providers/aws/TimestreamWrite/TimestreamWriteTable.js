const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./TimestreamWriteCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DatabaseName, TableName }) => {
    assert(TableName);
    assert(DatabaseName);
  }),
  pick(["DatabaseName", "TableName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html
exports.TimestreamWriteTable = () => ({
  type: "Table",
  package: "timestream-write",
  client: "TimestreamWrite",
  propertiesDefault: {
    RetentionProperties: {
      MagneticStoreRetentionPeriodInDays: 1825,
      MemoryStoreRetentionPeriodInHours: 24,
    },
    MagneticStoreWriteProperties: {
      EnableMagneticStoreWrites: false,
    },
  },
  omitProperties: [
    "DatabaseName",
    "Arn",
    "TableStatus",
    "CreationTime",
    "LastUpdatedTime",
    "MagneticStoreWriteProperties.MagneticStoreRejectedDataLocation.S3Configuration.KmsKeyId",
  ],
  inferName: () =>
    pipe([
      get("TableName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("TableName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    database: {
      type: "Database",
      group: "TimestreamWrite",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DatabaseName"),
          tap((DatabaseName) => {
            assert(DatabaseName);
          }),
        ]),
    },
    // TODO s3 bucket
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get(
          "MagneticStoreWriteProperties.MagneticStoreRejectedDataLocation.S3Configuration.KmsKeyId"
        ),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#getTable-property
  getById: {
    method: "describeTable",
    getField: "Table",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#listTables-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Database", group: "TimestreamWrite" },
          pickKey: pipe([pick(["DatabaseName"])]),
          method: "listTables",
          getParam: "Tables",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#createTable-property
  create: {
    method: "createTable",
    pickCreated: ({ payload }) => pipe([get("Table")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#updateTable-property
  update: {
    method: "updateTable",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#deleteTable-property
  destroy: {
    method: "deleteTable",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { database, kmsKey },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(database);
      }),
      () => otherProps,
      defaultsDeep({
        DatabaseName: database.config.DatabaseName,
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          MagneticStoreWriteProperties: {
            MagneticStoreRejectedDataLocation: {
              S3Configuration: { KmsKeyId: getField(kmsKey, "Arn") },
            },
          },
        })
      ),
    ])(),
});
