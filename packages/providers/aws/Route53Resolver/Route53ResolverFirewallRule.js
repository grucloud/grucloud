const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, unless, isEmpty, find } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ FirewallDomainListId, FirewallRuleGroupId }) => {
    assert(FirewallDomainListId);
    assert(FirewallRuleGroupId);
  }),
  pick(["FirewallDomainListId", "FirewallRuleGroupId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverFirewallRule = () => ({
  type: "FirewallRule",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  omitProperties: [
    "FirewallDomainListId",
    "FirewallRuleGroupId",
    "CreatorRequestId",
    "CreationTime",
    "ModificationTime",
  ],
  inferName: () => get("Name"),
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("FirewallRuleId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    firewallDomainList: {
      type: "FirewallDomainList",
      group: "Route53Resolver",
      dependencyId: ({ lives, config }) => get("FirewallDomainListId"),
    },
    firewallRuleGroup: {
      type: "FirewallRuleGroup",
      group: "Route53Resolver",
      parent: true,
      dependencyId: ({ lives, config }) => get("FirewallRuleGroupId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listFirewallRules-property
  getById:
    ({ endpoint, config }) =>
    ({ lives }) =>
    (live) =>
      tryCatch(
        pipe([
          tap(() => {
            assert(live.Name);
            assert(live.FirewallRuleGroupId);
          }),
          () => live,
          pick(["FirewallRuleGroupId"]),
          endpoint().listFirewallRules,
          get("FirewallRules"),
          tap((params) => {
            assert(true);
          }),
          find(eq(get("Name"), live.Name)),
          unless(isEmpty, decorate({ endpoint })),
        ]),
        //TODO  ResourceNotFoundException
        (error) => undefined
      )(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listFirewallRules-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "FirewallRuleGroup", group: "Route53Resolver" },
          pickKey: pipe([pick(["FirewallRuleGroupId"])]),
          method: "listFirewallRules",
          getParam: "FirewallRules",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createFirewallRule-property
  create: {
    method: "createFirewallRule",
    pickCreated: ({ payload }) => pipe([get("FirewallRule")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateFirewallDomains-property
  update: {
    method: "updateFirewallRule",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteFirewallRule-property
  destroy: {
    method: "deleteFirewallRule",
    pickId,
  },
  getByName:
    ({ getById, endpoint }) =>
    ({ name, resolvedDependencies: { firewallRuleGroup } }) =>
      pipe([
        tap((params) => {
          assert(firewallRuleGroup.live);
        }),
        () => ({
          FirewallRuleGroupId: firewallRuleGroup.live.FirewallRuleGroupId,
        }),
        endpoint().listFirewallRules,
        get("FirewallRules"),
        find(eq(get("Name"), name)),
        unless(isEmpty, decorate({ endpoint })),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { firewallRuleGroup, firewallDomainList },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(firewallRuleGroup);
        assert(firewallDomainList);
      }),
      () => otherProps,
      defaultsDeep({
        FirewallDomainListId: getField(
          firewallDomainList,
          "FirewallDomainListId"
        ),
        FirewallRuleGroupId: getField(firewallRuleGroup, "FirewallRuleGroupId"),
      }),
    ])(),
});
