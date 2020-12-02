const { isOurMinion } = require("../AwsCommon");
const { AwsDomain } = require("./AwsDomain");

module.exports = [
  {
    type: "Route53Domain",
    Client: ({ spec, config }) => AwsDomain({ spec, config }),
    listOnly: true,
    isOurMinion,
  },
];
