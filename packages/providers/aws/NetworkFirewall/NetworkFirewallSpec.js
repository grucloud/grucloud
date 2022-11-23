const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { Firewall } = require("./Firewall");
const { FirewallPolicy } = require("./FirewallPolicy");
const { FirewallRuleGroup } = require("./FirewallRuleGroup");
const {
  FirewallLoggingConfiguration,
} = require("./FirewallLoggingConfiguration");

const GROUP = "NetworkFirewall";
const compare = compareAws({});

module.exports = pipe([
  () => [
    Firewall({ compare }),
    FirewallLoggingConfiguration({ compare }),
    FirewallPolicy({ compare }),
    FirewallRuleGroup({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
