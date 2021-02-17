const { isOurMinion } = require("../AwsCommon");
const { AwsHostedZone, compareHostedZone } = require("./AwsHostedZone");
const { Route53Record, compareRoute53Record } = require("./Route53Record");

module.exports = [
  {
    type: "HostedZone",
    Client: AwsHostedZone,
    isOurMinion,
    compare: compareHostedZone,
  },
  {
    type: "Route53Record",
    dependsOn: ["HostedZone", "Certificate"],
    Client: Route53Record,
    isOurMinion,
    compare: compareRoute53Record,
  },
];
