const assert = require("assert");
const { pipe, tap, get, eq, not, assign, map, pick } = require("rubico");
const { defaultsDeep, first, find, when, unless } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./Route53ResolverCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const cannotBeDeleted = ({ config }) =>
  pipe([not(eq(get("live.OwnerId"), config.accountId()))]);

const pickId = pipe([
  ({ Id }) => ({ ResolverRuleId: Id }),
  tap(({ ResolverRuleId }) => {
    assert(ResolverRuleId);
  }),
]);

const model = ({ config }) => ({
  package: "route53resolver",
  client: "Route53Resolver",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverRule-property
  getById: { method: "getResolverRule", getField: "ResolverRule", pickId },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverRules-property
  getList: {
    method: "listResolverRules",
    getParam: "ResolverRules",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listTagsForResource-property
        when(eq(get("OwnerId"), config.accountId()), assignTags({ endpoint })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createResolverRule-property
  create: {
    method: "createResolverRule",
    pickCreated: ({ payload }) => pipe([get("ResolverRule")]),
    isInstanceUp: pipe([eq(get("Status"), "COMPLETE")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED")]),
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverRule = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    cannotBeDeleted: cannotBeDeleted({ config }),
    managedByOther: cannotBeDeleted({ config }),
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Arn")]),
    findDependencies: ({ live, lives }) => [
      {
        type: "Endpoint",
        group: "Route53Resolver",
        ids: [
          pipe([
            () =>
              lives.getByType({
                type: "Endpoint",
                group: "Route53Resolver",
                providerName: config.providerName,
              }),
            find(eq(get("live.Id"), live.ResolverEndpointId)),
            get("id"),
          ])(),
        ],
      },
    ],
    getByName: ({ endpoint }) =>
      pipe([
        ({ name }) => ({ Filters: [{ Name: "Name", Values: [name] }] }),
        endpoint().listResolverRules,
        get("ResolverRules"),
        first,
      ]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { resolverEndpoint },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          CreatorRequestId: `${new Date()}`,
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
                tap((params) => {
                  assert(true);
                }),
                assign({
                  TargetIps: pipe([
                    () => resolverEndpoint,
                    get("live.IpAddresses", []),
                    map(
                      pipe([
                        pick(["Ip"]),
                        tap((params) => {
                          assert(true);
                        }),
                        defaultsDeep({ Port: 53 }),
                      ])
                    ),
                  ]),
                }),
              ])
            ),
          ])
        ),
      ])(),
  });
