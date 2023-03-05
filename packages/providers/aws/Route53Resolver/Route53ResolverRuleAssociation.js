const assert = require("assert");
const { pipe, tap, get, pick, eq, fork, or } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const cannotBeDeleted = ({ config, lives }) =>
  or([
    eq(get("Name"), "System Rule Association"),
    (live) =>
      pipe([
        tap((params) => {
          assert(live.ResolverRuleId);
        }),
        lives.getByType({
          type: "Rule",
          group: "Route53Resolver",
          providerName: config.providerName,
        }),
        tap((params) => {
          assert(live.ResolverRuleId);
        }),
        find(eq(get("live.Id"), live.ResolverRuleId)),
        get("cannotBeDeleted"),
        tap((params) => {
          assert(live.ResolverRuleId);
        }),
      ])(),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverRuleAssociation = ({}) => ({
  type: "RuleAssociation",
  package: "route53resolver",
  client: "Route53Resolver",
  cannotBeDeleted: cannotBeDeleted,
  managedByOther: cannotBeDeleted,
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
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          vpcName: pipe([
            get("VPCId"),
            lives.getById({
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name", live.VPCId),
          ]),
          ruleName: pipe([
            lives.getByType({
              type: "Rule",
              group: "Route53Resolver",
              providerName: config.providerName,
            }),
            find(eq(get("live.Id"), live.ResolverRuleId)),
            get("name", live.ResolverRuleId),
          ]),
        }),
        ({ vpcName, ruleName }) => `rule-assoc::${ruleName}::${vpcName}`,
        tap((Name) => {
          assert(Name);
        }),
      ])(),
  findId: () => pipe([get("Id")]),
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
  omitProperties: ["Id", "Status", "ResolverRuleId", "VPCId", "StatusMessage"],
  // listResolverRuleAssociations with Name as a filter does not work
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverRuleAssociation-property
  getById: {
    method: "getResolverRuleAssociation",
    getField: "ResolverRuleAssociation",
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      ({ Id }) => ({ ResolverRuleAssociationId: Id }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverRuleAssociations-property
  getList: {
    method: "listResolverRuleAssociations",
    getParam: "ResolverRuleAssociations",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#associateResolverRule-property
  create: {
    method: "associateResolverRule",
    pickCreated: ({ payload }) => pipe([get("ResolverRuleAssociation")]),
    isInstanceUp: pipe([eq(get("Status"), "COMPLETE")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED")]),
    getErrorMessage: get("StatusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#disassociateResolverRule-property
  destroy: {
    method: "disassociateResolverRule",
    pickId: pipe([
      tap(({ VPCId, ResolverRuleId }) => {
        assert(VPCId);
        assert(ResolverRuleId);
      }),
      pick(["VPCId", "ResolverRuleId"]),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { resolverRule, vpc },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(resolverRule);
        assert(vpc);
      }),
      () => properties,
      defaultsDeep({
        //Name: name,
        ResolverRuleId: getField(resolverRule, "Id"),
        VPCId: getField(vpc, "VpcId"),
      }),
    ])(),
});
