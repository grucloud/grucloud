const assert = require("assert");
const { assign, map, omit, pipe, tap, pick, eq, get } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { DynamoDBTable } = require("./DynamoDBTable");
const {
  DynamoDBKinesisStreamingDestination,
} = require("./DynamoDBKinesisStreamingDestination");
const GROUP = "DynamoDB";
const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    DynamoDBTable({}),
    DynamoDBKinesisStreamingDestination({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, isOurMinion, compare: compare({}) }),
    ])
  ),
]);
