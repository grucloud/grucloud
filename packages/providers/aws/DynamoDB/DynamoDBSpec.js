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
      inferName: () => get("TableName"),
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
      ],
      propertiesDefault: {},
      compare: compareDynamoDB({}),
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
      inferName: ({ dependenciesSpec: { table, kinesisStream } }) =>
        pipe([
          tap((params) => {
            assert(table);
            assert(kinesisStream);
          }),
          () => `table-kinesis-stream::${table}::${kinesisStream}`,
        ]),
      dependencies: {
        table: {
          type: "Table",
          group: "DynamoDB",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("TableName"),
              lives.getByName({
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
