const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  map,
  pick,
  omit,
  fork,
  and,
} = require("rubico");
const {
  pluck,
  defaultsDeep,
  first,
  when,
  unless,
  callProp,
  isDeepEqual,
  find,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { ipToInt32 } = require("@grucloud/core/ipUtils");

const { buildTags, getNewCallerReference } = require("../AwsCommon");
const { Tagger, assignTags } = require("./Route53ResolverCommon");

const cannotBeDeleted = ({ config }) =>
  pipe([not(eq(get("OwnerId"), config.accountId()))]);

const pickId = pipe([({ Id }) => ({ ResolverRuleId: Id })]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    when(
      get("TargetIps"),
      assign({
        TargetIps: pipe([
          get("TargetIps"),
          callProp("sort", (a, b) =>
            ipToInt32(a.Ip) > ipToInt32(b.Ip) ? 1 : -1
          ),
        ]),
      })
    ),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listTagsForResource-property
    when(eq(get("OwnerId"), config.accountId()), assignTags({ endpoint })),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverRule = ({ spec, config }) => ({
  type: "Rule",
  package: "route53resolver",
  client: "Route53Resolver",
  cannotBeDeleted: cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Arn")]),
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
  getByName: ({ endpoint }) =>
    pipe([
      ({ name }) => ({ Filters: [{ Name: "Name", Values: [name] }] }),
      endpoint().listResolverRules,
      get("ResolverRules"),
      first,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverRule-property
  getById: { method: "getResolverRule", getField: "ResolverRule", pickId },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverRules-property
  getList: {
    method: "listResolverRules",
    getParam: "ResolverRules",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createResolverRule-property
  create: {
    method: "createResolverRule",
    pickCreated: ({ payload }) => pipe([get("ResolverRule")]),
    isInstanceUp: pipe([eq(get("Status"), "COMPLETE")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED")]),
    getErrorMessage: get("StatusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateResolverRule-property
  update: {
    method: "updateResolverRule",
    filterParams: ({ payload, live, diff }) =>
      pipe([
        () => payload,
        pick(["Name", "TargetIps", "ResolverEndpointId"]),
        omitIfEmpty(["TargetIps"]),
        (Config) => ({ ResolverRuleId: live.Id, Config }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteResolverRule-property
  destroy: { method: "deleteResolverRule", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { resolverEndpoint },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        CreatorRequestId: getNewCallerReference(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => resolverEndpoint,
        pipe([
          defaultsDeep({
            ResolverEndpointId: getField(resolverEndpoint, "Id"),
          }),
          unless(
            get("TargetIps"),
            pipe([
              assign({
                TargetIps: pipe([
                  () => resolverEndpoint,
                  get("live.IpAddresses", []),
                  map(pipe([pick(["Ip"]), defaultsDeep({ Port: 53 })])),
                ]),
              }),
            ])
          ),
        ])
      ),
    ])(),
});
