const assert = require("assert");
const { map, pipe } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { DynamoDBTable } = require("./DynamoDBTable");
const { DynamoDBTableItem } = require("./DynamoDBTableItem");
const {
  DynamoDBKinesisStreamingDestination,
} = require("./DynamoDBKinesisStreamingDestination");

const GROUP = "DynamoDB";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    DynamoDBTable({}),
    DynamoDBTableItem({}),
    DynamoDBKinesisStreamingDestination({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, isOurMinion, compare: compare({}) }),
    ])
  ),
]);
