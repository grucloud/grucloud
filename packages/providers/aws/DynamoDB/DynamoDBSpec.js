const { assign, map } = require("rubico");
const { isOurMinionObject, isOurMinion } = require("../AwsCommon");

const { DynamoDBTable } = require("./DynamoDBTable");

const GROUP = "dynamoDB";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Table",
      Client: DynamoDBTable,
      isOurMinion,
    },
  ]);
