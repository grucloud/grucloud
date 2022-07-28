const assert = require("assert");
const { assign, map, omit, pipe, tap, pick, eq, get } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { DynamoDBTable } = require("./DynamoDBTable");
const {
  DynamoDBKinesisStreamingDestination,
} = require("./DynamoDBKinesisStreamingDestination");
const GROUP = "DynamoDB";
const compareDynamoDB = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Table",
      Client: DynamoDBTable,
      inferName: get("properties.TableName"),
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
        "SSEDescription",
        "BillingModeSummary.LastUpdateToPayPerRequestDateTime",
      ],
      compare: compareDynamoDB({
        filterAll: () =>
          pipe([
            defaultsDeep({
              BillingMode: "PAY_PER_REQUEST",
              ProvisionedThroughput: {
                ReadCapacityUnits: 0,
                WriteCapacityUnits: 0,
              },
            }),
            ({ BillingMode, ...other }) => ({
              ...other,
              BillingModeSummary: { BillingMode },
            }),
          ]),
        filterLive: () =>
          pipe([
            omitIfEmpty([
              "ProvisionedThroughput.ReadCapacityUnits",
              "ProvisionedThroughput.WriteCapacityUnits",
            ]),
          ]),
      }),
      filterLive: () =>
        pipe([
          //TODO remove pick
          pick([
            "TableName",
            "AttributeDefinitions",
            "KeySchema",
            "ProvisionedThroughput",
            "BillingModeSummary",
            "GlobalSecondaryIndexes",
            "LocalSecondaryIndexes",
          ]),
          when(
            eq(get("BillingModeSummary.BillingMode"), "PAY_PER_REQUEST"),
            pipe([
              assign({ BillingMode: () => "PAY_PER_REQUEST" }),
              omit(["ProvisionedThroughput", "BillingModeSummary"]),
            ])
          ),
        ]),
      dependencies: {
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) =>
            get("SSEDescription.KMSMasterKeyId"),
        },
      },
    },
    {
      type: "KinesisStreamingDestination",
      Client: DynamoDBKinesisStreamingDestination,
      omitProperties: ["TableName", "StreamArn", "DestinationStatus"],
      inferName: pipe([
        get("dependenciesSpec"),
        ({ table, kinesisStream }) =>
          `table-kinesis-stream::${table}::${kinesisStream}`,
      ]),
      dependencies: {
        table: {
          type: "Table",
          group: "DynamoDB",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) =>
                lives.getByName({
                  name: live.TableName,
                  type: "Table",
                  group: "DynamoDB",
                  providerName: config.providerName,
                }),
              get("id"),
              tap((id) => {
                assert(id);
              }),
            ]),
        },
        kinesisStream: {
          type: "Stream",
          group: "Kinesis",
          dependencyId: ({ lives, config }) => get("StreamArn"),
        },
      },
    },
  ],
  map(
    defaultsDeep({ group: GROUP, isOurMinion, compare: compareDynamoDB({}) })
  ),
]);
