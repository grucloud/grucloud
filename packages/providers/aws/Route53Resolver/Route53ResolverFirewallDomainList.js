const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./Route53ResolverCommon");

const pickId = pipe([
  tap(({ FirewallDomainListId }) => {
    assert(FirewallDomainListId);
  }),
  pick(["FirewallDomainListId"]),
]);

const toFirewallDomainListId = ({ Id, ...other }) => ({
  FirewallDomainListId: Id,
  ...other,
});

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const cannotBeDeleted = () => pipe([get("ManagedOwnerName")]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toFirewallDomainListId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverFirewallDomainList = () => ({
  type: "FirewallDomainList",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  omitProperties: [
    "Id",
    "Arn",
    "DomainCount",
    "Status",
    "StatusMessage",
    "ManagedOwnerName",
    "CreatorRequestId",
    "CreationTime",
    "ModificationTime",
  ],
  inferName: () => get("Name"),
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("FirewallDomainListId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getFirewallDomainList-property
  getById: {
    method: "getFirewallDomainList",
    getField: "FirewallDomainList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listFirewallDomainLists-property
  getList: {
    method: "listFirewallDomainLists",
    getParam: "FirewallDomainLists",
    decorate: ({ getById }) => pipe([toFirewallDomainListId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createFirewallDomainList-property
  create: {
    method: "createFirewallDomainList",
    pickCreated: ({ payload }) => pipe([get("FirewallDomainList")]),
    isInstanceUp: pipe([eq(get("Status"), "COMPLETE")]),
    isInstanceError: pipe([eq(get("Status"), "COMPLETE_IMPORT_FAILED")]),
    getErrorMessage: get("StatusMessage", "COMPLETE_IMPORT_FAILED"),
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
          FirewallDomainListId: live.FirewallDomainListId,
          Operation: "replace",
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteFirewallDomainList-property
  destroy: {
    method: "deleteFirewallDomainList",
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
