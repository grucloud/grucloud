const { isOurMinion } = require("../AwsCommon");
const { AwsHostedZone, compareHostedZone } = require("./AwsHostedZone");
const { Route53Record, compareRoute53Record } = require("./Route53Record");

module.exports = [
  {
    type: "HostedZone",
    Client: ({ spec, config }) => AwsHostedZone({ spec, config }),
    isOurMinion,
    compare: compareHostedZone,
  },
  {
    type: "Route53Record",
    dependsOn: ["HostedZone", "Certificate"],
    Client: ({ spec, config }) => Route53Record({ spec, config }),
    isOurMinion,
    compare: compareRoute53Record,
  },
];
