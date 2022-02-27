const assert = require("assert");
const { assign, map, omit, pipe, tap, pick, eq, get } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");
const { compareAws, isOurMinion } = require("../AwsCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { DynamoDBTable } = require("./DynamoDBTable");

const GROUP = "DynamoDB";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Table",
      Client: DynamoDBTable,
      isOurMinion,
      compare: compareAws({
        filterAll: pipe([
          omit(["Tags"]),
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
            tap((params) => {
              assert(true);
            }),
            omit([
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
            ]),
            tap((params) => {
              assert(true);
            }),
            omitIfEmpty([
              "ProvisionedThroughput.ReadCapacityUnits",
              "ProvisionedThroughput.WriteCapacityUnits",
            ]),
          ]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "AttributeDefinitions",
            "KeySchema",
            "ProvisionedThroughput",
            "BillingModeSummary",
            "GlobalSecondaryIndexes",
            "LocalSecondaryIndexes",
          ]),
          omit([
            "ProvisionedThroughput.NumberOfDecreasesToday",
            "BillingModeSummary.LastUpdateToPayPerRequestDateTime",
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
        kmsKey: { type: "Key", group: "KMS" },
      },
    },
  ]);
