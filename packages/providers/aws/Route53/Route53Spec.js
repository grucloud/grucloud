const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { AwsHostedZone, compareHostedZone } = require("./AwsHostedZone");
const { Route53Record, compareRoute53Record } = require("./Route53Record");

const GROUP = "route53";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "HostedZone",
      dependsOn: ["Route53Domain"],
      Client: AwsHostedZone,
      isOurMinion,
      compare: compareHostedZone,
    },
    {
      type: "Route53Record",
      dependsOn: ["HostedZone", "Certificate"],
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
    },
  ]);
