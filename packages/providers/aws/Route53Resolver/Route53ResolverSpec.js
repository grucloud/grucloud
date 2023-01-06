const assert = require("assert");
const { tap, pipe, map, assign, eq, get, fork, omit, and } = require("rubico");
const {
  defaultsDeep,
  when,
  callProp,
  pluck,
  isDeepEqual,
  find,
} = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");

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
    createAwsService(Route53ResolverConfig({})),
    createAwsService(Route53ResolverDnssecConfig({})),
    {
      type: "Endpoint",
      Client: Route53ResolverEndpoint,
      omitProperties: [
        "Id",
        "CreatorRequestId",
        "SecurityGroupIds",
        "Status",
        "Arn",
        "StatusMessage",
        "CreationTime",
        "ModificationTime",
        "IpAddressCount",
        "HostVPCId",
        "IpAddresses[].CreationTime",
        "IpAddresses[].Ip",
        "IpAddresses[].IpId",
        "IpAddresses[].ModificationTime",
        "IpAddresses[].Status",
        "IpAddresses[].StatusMessage",
      ],
      inferName: () =>
        pipe([
          get("Name"),
          tap((Name) => {
            assert(Name);
          }),
        ]),
      dependencies: {
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("IpAddresses"), pluck("SubnetId")]),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            IpAddresses: pipe([
              get("IpAddresses"),
              map(
                fork({
                  SubnetId: pipe([
                    get("SubnetId"),
                    replaceWithName({
                      type: "Subnet",
                      group: "EC2",
                      pathLive: "id",
                      path: "id",
                      lives,
                      providerConfig,
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    createAwsService(Route53ResolverFirewallConfig({})),
    createAwsService(Route53ResolverFirewallDomainList({})),
    createAwsService(Route53ResolverFirewallRule({})),
    createAwsService(Route53ResolverFirewallRuleGroup({})),
    createAwsService(Route53ResolverFirewallRuleGroupAssociation({})),
    {
      type: "Rule",
      Client: Route53ResolverRule,
      dependencies: {
        resolverEndpoint: {
          type: "Endpoint",
          group: "Route53Resolver",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                lives.getByType({
                  type: "Endpoint",
                  group: "Route53Resolver",
                  providerName: config.providerName,
                }),
                find(eq(get("live.Id"), live.ResolverEndpointId)),
                get("id"),
              ])(),
        },
      },
      omitProperties: [
        "Id",
        "CreatorRequestId",
        "StatusMessage",
        "Status",
        "Arn",
        "ResolverEndpointId",
        "OwnerId",
        "ShareStatus",
        "CreationTime",
        "ModificationTime",
      ],
      inferName: () =>
        pipe([
          get("Name"),
          tap((Name) => {
            assert(Name);
          }),
        ]),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(
            ({ ResolverEndpointId, TargetIps }) =>
              pipe([
                fork({
                  IpAddresses: pipe([
                    () => lives,
                    find(
                      and([
                        eq(get("groupType"), "Route53Resolver::Endpoint"),
                        eq(get("live.Id"), ResolverEndpointId),
                      ])
                    ),
                    get("live.IpAddresses"),
                    pluck("Ip"),
                    callProp("sort", (a, b) => a.localeCompare(b)),
                  ]),
                  TargetIpArray: pipe([
                    () => TargetIps,
                    pluck("Ip"),
                    callProp("sort", (a, b) => a.localeCompare(b)),
                  ]),
                }),
                ({ IpAddresses, TargetIpArray }) =>
                  isDeepEqual(IpAddresses, TargetIpArray),
              ])(),
            omit(["TargetIps"])
          ),
        ]),
    },
    {
      type: "RuleAssociation",
      Client: Route53ResolverRuleAssociation,
      dependencies: {
        resolverRule: {
          type: "Rule",
          group: "Route53Resolver",
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                lives.getByType({
                  type: "Rule",
                  group: "Route53Resolver",
                  providerName: config.providerName,
                }),
                find(eq(get("live.Id"), live.ResolverRuleId)),
                get("id"),
              ])(),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VPCId"),
        },
      },
      inferName:
        ({ dependenciesSpec: { resolverRule, vpc } }) =>
        () =>
          pipe([
            tap((params) => {
              assert(resolverRule);
              assert(vpc);
            }),
            () => `rule-assoc::${resolverRule}::${vpc}`,
          ])(),
      omitProperties: [
        "Id",
        "Status",
        "ResolverRuleId",
        "VPCId",
        "StatusMessage",
      ],
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareRoute53Resolver({}),
    })
  ),
]);
