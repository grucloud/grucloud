const { isOurMinion } = require("../AwsCommon");
const { AwsDomain } = require("./AwsDomain");

module.exports = [
  {
    type: "Route53Domain",
    Client: AwsDomain,
    listOnly: true,
    isOurMinion,
  },
];
