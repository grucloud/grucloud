const { assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");

const { SSMParameter } = require("./SSMParameter");

const GROUP = "ssm";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Parameter",
      Client: SSMParameter,
      isOurMinion,
    },
  ]);
