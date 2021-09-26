const assert = require("assert");
const { assign, map, omit, pipe, tap } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");

const { DynamoDBTable } = require("./DynamoDBTable");
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "DynamoDB";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Table",
      Client: DynamoDBTable,
      isOurMinion,
      compare: compare({
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
        filterLive: pipe([
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
    },
  ]);
