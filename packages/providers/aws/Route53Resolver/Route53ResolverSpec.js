const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { Route53ResolverConfig } = require("./Route53ResolverConfig");
const {
  Route53ResolverDnssecConfig,
} = require("./Route53ResolverDnssecConfig");

const { Route53ResolverEndpoint } = require("./Route53ResolverEndpoint");
const {
  Route53ResolverFirewallConfig,
} = require("./Route53ResolverFirewallConfig");
const {
  Route53ResolverFirewallDomainList,
} = require("./Route53ResolverFirewallDomainList");

const {
  Route53ResolverFirewallRule,
} = require("./Route53ResolverFirewallRule");
const {
  Route53ResolverFirewallRuleGroup,
} = require("./Route53ResolverFirewallRuleGroup");
const {
  Route53ResolverFirewallRuleGroupAssociation,
} = require("./Route53ResolverFirewallRuleGroupAssociation");
const { Route53ResolverRule } = require("./Route53ResolverRule");
const {
  Route53ResolverRuleAssociation,
} = require("./Route53ResolverRuleAssociation");

const GROUP = "Route53Resolver";

const compareRoute53Resolver = compareAws({});

module.exports = pipe([
  () => [
    Route53ResolverConfig({}),
    Route53ResolverDnssecConfig({}),
    Route53ResolverEndpoint({}),
    Route53ResolverFirewallConfig({}),
    Route53ResolverFirewallDomainList({}),
    Route53ResolverFirewallRule({}),
    Route53ResolverFirewallRuleGroup({}),
    Route53ResolverFirewallRuleGroupAssociation({}),
    Route53ResolverRule({}),
    Route53ResolverRuleAssociation({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        compare: compareRoute53Resolver({}),
      }),
    ])
  ),
]);
