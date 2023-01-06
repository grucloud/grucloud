const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, unless, isEmpty, find } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger } = require("./Route53ResolverCommon");

const pickId = pipe([
  tap(({ FirewallRuleGroupAssociationId }) => {
    assert(FirewallRuleGroupAssociationId);
  }),
  pick(["FirewallRuleGroupAssociationId"]),
]);

const toFirewallRuleGroupAssociationId = ({ Id, ...other }) => ({
  FirewallRuleGroupAssociationId: Id,
  ...other,
});

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toFirewallRuleGroupAssociationId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverFirewallRuleGroupAssociation = () => ({
  type: "FirewallRuleGroupAssociation",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  omitProperties: [
    "FirewallRuleGroupAssociationId",
    "FirewallDomainListId",
    "FirewallRuleGroupId",
    "Status",
    "StatusMessage",
    "CreatorRequestId",
    "CreationTime",
    "ModificationTime",
  ],
  inferName: () => get("Name"),
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("FirewallRuleGroupAssociationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    firewallRuleGroup: {
      type: "FirewallRuleGroup",
      group: "Route53Resolver",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("FirewallRuleGroupId"),
          tap((FirewallRuleGroupId) => {
            assert(FirewallRuleGroupId);
          }),
        ]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("VpcId"),
          tap((VpcId) => {
            assert(VpcId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listFirewallRules-property
  getById:
    ({ endpoint, config }) =>
    ({ lives }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.FirewallRuleGroupId);
          assert(live.VpcId);
        }),
        () => live,
        pick(["FirewallRuleGroupId", "VpcId"]),
        endpoint().listFirewallRuleGroupAssociations,
        get("FirewallRuleGroupAssociations"),
        find(eq(get("Id"), live.FirewallRuleGroupAssociationId)),
        unless(isEmpty, decorate({ endpoint })),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listFirewallRuleGroupAssociations-property
  getList: {
    method: "listFirewallRuleGroupAssociations",
    getParam: "FirewallRuleGroupAssociations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#associateFirewallRuleGroup-property
  create: {
    method: "associateFirewallRuleGroup",
    pickCreated: ({ payload }) => pipe([get("FirewallRuleGroupAssociation")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateFirewallRuleGroupAssociation-property
  update: {
    method: "updateFirewallRuleGroupAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteFirewallRule-property
  destroy: {
    method: "disassociateFirewallRuleGroup",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { firewallRuleGroup, vpc },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(firewallRuleGroup);
        assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        FirewallRuleGroupId: getField(firewallRuleGroup, "FirewallRuleGroupId"),
        VpcId: getField(vpc, "VpcId"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
