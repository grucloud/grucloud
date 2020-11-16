const { isOurMinion } = require("../AwsCommon");
const { AwsHostedZone, compareHostedZone } = require("./AwsHostedZone");

module.exports = [
  {
    type: "HostedZone",
    Client: ({ spec, config }) => AwsHostedZone({ spec, config }),
    isOurMinion,
    compare: compareHostedZone,
  },
];
