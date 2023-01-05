const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./Route53ResolverCommon");

const pickId = pipe([
  tap(({ FirewallRuleGroupId }) => {
    assert(FirewallRuleGroupId);
  }),
  pick(["FirewallRuleGroupId"]),
]);

const toFirewallRuleGroupId = ({ Id, ...other }) => ({
  FirewallRuleGroupId: Id,
  ...other,
});

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

//const cannotBeDeleted = () => pipe([get("ManagedOwnerName")]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toFirewallRuleGroupId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverFirewallRuleGroup = () => ({
  type: "FirewallRuleGroup",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  //cannotBeDeleted,
  //managedByOther: cannotBeDeleted,
  omitProperties: [
    "FirewallRuleGroupId",
    "Arn",
    "DomainCount",
    "Status",
    "StatusMessage",
    "RuleCount",
    "OwnerId",
    "CreatorRequestId",
    "ShareStatus",
    "CreationTime",
    "ModificationTime",
  ],
  inferName: () => get("Name"),
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("FirewallRuleGroupId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getFirewallRuleGroup-property
  getById: {
    method: "getFirewallRuleGroup",
    getField: "FirewallRuleGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listFirewallRuleGroups-property
  getList: {
    method: "listFirewallRuleGroups",
    getParam: "FirewallRuleGroups",
    decorate: ({ getById }) => pipe([toFirewallRuleGroupId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createFirewallRuleGroup-property
  create: {
    method: "createFirewallRuleGroup",
    pickCreated: ({ payload }) => pipe([get("FirewallRuleGroup")]),
    isInstanceUp: pipe([eq(get("Status"), "COMPLETE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateFirewallDomains-property
  update: {
    method: "updateFirewallDomains",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(payload.Domains);
        }),
        () => ({
          Domains: payload.Domains,
          FirewallRuleGroupId: live.FirewallRuleGroupId,
          Operation: "replace",
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteFirewallRuleGroup-property
  destroy: {
    method: "deleteFirewallRuleGroup",
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
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
