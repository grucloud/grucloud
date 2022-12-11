const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, unless, callProp } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { Tagger } = require("./GlueCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name", "DatabaseName", "CatalogId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["PartitionKeys"]),
  ]);

const filterPayload = ({ CatalogId, DatabaseName, Tags, ...other }) =>
  pipe([
    () => ({ TableInput: other, CatalogId, DatabaseName, Tags }),
    tap((params) => {
      assert(true);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueTable = () => ({
  type: "Table",
  package: "glue",
  client: "Glue",
  propertiesDefault: {
    IsRegisteredWithLakeFormation: false,
    Description: "",
    Parameters: {
      classification: "json",
    },
    TableType: "EXTERNAL_TABLE",
  },
  omitProperties: [
    "Arn",
    "Owner",
    "CreateTime",
    "UpdateTime",
    "LastAccessTime",
    "LastAnalyzedTime",
    "CreatedBy",
    "DatabaseName",
    "VersionId",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Name "),
      tap((id) => {
        assert(id);
      }),
    ]),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    database: {
      type: "Database",
      group: "Glue",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DatabaseName"),
          lives.getByName({
            type: "Database",
            group: "Glue",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("StorageDescriptor.Location"),
          callProp("replace", "s3://", ""),
          lives.getById({
            type: "Database",
            group: "Glue",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  ignoreErrorCodes: ["EntityNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        CatalogId: pipe([
          get("CatalogId"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getTable-property
  getById: {
    method: "getTable",
    getField: "Table",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getTables-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Database", group: "Glue" },
          pickKey: pipe([
            ({ Name, CatalogId }) => ({ DatabaseName: Name, CatalogId }),
          ]),
          method: "getTables",
          getParam: "TableList",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createTable-property
  create: {
    filterPayload,
    method: "createTable",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateTable-property
  update: {
    method: "updateTable",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        () => payload,
        filterPayload,
        defaultsDeep({ Name: payload.name }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteTable-property
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
    properties: { ...otherProps },
    dependencies: { database },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DatabaseName: getField(database, "Name"),
      }),
    ])(),
});
