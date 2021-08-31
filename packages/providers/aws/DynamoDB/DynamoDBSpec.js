const { assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");

const { DynamoDBTable } = require("./DynamoDBTable");

const GROUP = "DynamoDB";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Table",
      Client: DynamoDBTable,
      isOurMinion,
    },
  ]);
