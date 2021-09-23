const assert = require("assert");
const { assign, map, omit, pipe } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { DynamoDBTable } = require("./DynamoDBTable");

const GROUP = "DynamoDB";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Table",
      Client: DynamoDBTable,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["tags"])]),
        filterLive: pipe([
          omit([
            "TableSizeBytes",
            "ItemCount",
            "TableArn",
            "TableId",
            "ProvisionedThroughput.NumberOfDecreasesToday",
            "CreationDateTime",
            "TableStatus",
          ]),
        ]),
      }),
    },
  ]);
