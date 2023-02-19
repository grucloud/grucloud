const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, omit, map } = require("rubico");
const { defaultsDeep, when, find } = require("rubico/x");

const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags } = require("./DynamoDBCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const isInstanceUp = eq(get("TableStatus"), "ACTIVE");

const findName = () =>
  pipe([
    get("TableName"),
    tap((TableName) => {
      assert(TableName);
    }),
  ]);

const pickId = pick(["TableName"]);

const buildArn = () =>
  pipe([
    get("TableArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignTags({ buildArn: buildArn(config), endpoint }),
    when(
      eq(get("BillingModeSummary.BillingMode"), "PAY_PER_REQUEST"),
      pipe([
        assign({ BillingMode: () => "PAY_PER_REQUEST" }),
        omit(["ProvisionedThroughput", "BillingModeSummary"]),
      ])
    ),
    omitIfEmpty(["Replicas"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
exports.DynamoDBTable = () => ({
  type: "Table",
  package: "dynamodb",
  client: "DynamoDB",
  propertiesDefault: {},
  omitProperties: [
    "TableSizeBytes",
    "ItemCount",
    "TableArn",
    "TableId",
    "ProvisionedThroughput.NumberOfDecreasesToday",
    "ProvisionedThroughput.LastIncreaseDateTime",
    "ProvisionedThroughput.LastDecreaseDateTime",
    "CreationDateTime",
    "TableStatus",
    "LatestStreamArn",
    "LatestStreamLabel",
    "SSEDescription", //TODO
    "SSEDescription.Status",
    "SSEDescription.KMSMasterKeyId",
    "LocalSecondaryIndexes[].IndexSizeBytes",
    "LocalSecondaryIndexes[].ItemCount",
    "GlobalSecondaryIndexes[].Backfilling",
    "GlobalSecondaryIndexes[].IndexSizeBytes",
    "GlobalSecondaryIndexes[].IndexStatus",
    "GlobalSecondaryIndexes[].ItemCount",
    "Replicas[].ReplicaStatus",
    "Replicas[].ReplicaStatusDescription",
    "Replicas[].ReplicaStatusPercentProgress",
    "Replicas[].KMSMasterKeyId",
    "Replicas[].ReplicaInaccessibleDateTime",
    "Replicas[].ReplicaTableClassSummary.LastUpdateDateTime",
    "ArchivalSummary",
    "TableClassSummary.LastUpdateDateTime",
  ],
  inferName: findName,
  findName,
  findId: () =>
    pipe([
      get("TableArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      //TODO remove pick
      pick([
        "TableName",
        "AttributeDefinitions",
        "KeySchema",
        "ProvisionedThroughput",
        "BillingMode",
        "GlobalSecondaryIndexes",
        "LocalSecondaryIndexes",
        "StreamSpecification",
      ]),
      when(
        get("GlobalSecondaryIndexes"),
        assign({
          GlobalSecondaryIndexes: pipe([
            get("GlobalSecondaryIndexes"),
            map(
              assign({
                IndexArn: pipe([
                  get("IndexArn"),
                  replaceAccountAndRegion({ lives, providerConfig }),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId:
        ({ lives, config }) =>
        ({ SSEDescription = {} }) =>
          pipe([
            lives.getByType({
              type: "Key",
              group: "KMS",
              providerName: config.providerName,
            }),
            find(eq(get("live.KeyId"), SSEDescription.KmsMasterKeyId)),
            get("id"),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#describeTable-property
  getById: {
    method: "describeTable",
    getField: "Table",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#listTables-property
  getList: {
    method: "listTables",
    getParam: "TableNames",
    decorate: ({ getById }) => pipe([(TableName) => ({ TableName }), getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
  create: {
    method: "createTable",
    isInstanceUp,
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateTable-property
  update: {
    method: "updateTable",
    isInstanceUp,
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteTable-property
  destroy: {
    method: "deleteTable",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ TableName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          SSEDescription: { KMSMasterKeyId: getField(kmsKey, "KeyId") },
        })
      ),
    ])(),
});
