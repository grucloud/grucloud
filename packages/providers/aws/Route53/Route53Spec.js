const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { Route53HostedZone, compareHostedZone } = require("./Route53HostedZone");
const { Route53Record, compareRoute53Record } = require("./Route53Record");

const GROUP = "route53";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "HostedZone",
      dependsOn: ["route53Domain::Domain"],
      Client: Route53HostedZone,
      isOurMinion,
      compare: compareHostedZone,
    },
    {
      type: "Record",
      dependsOn: ["route53::HostedZone", "acm::Certificate"],
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
    },
  ]);
