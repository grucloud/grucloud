const assert = require("assert");
const { pipe, tap, get, eq, not, assign, map, pick } = require("rubico");
const { defaultsDeep, first, when, unless, callProp } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { ipToInt32 } = require("@grucloud/core/ipUtils");

const { buildTags, getNewCallerReference } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./Route53ResolverCommon");

const cannotBeDeleted = ({ config }) =>
  pipe([not(eq(get("OwnerId"), config.accountId()))]);

const pickId = pipe([({ Id }) => ({ ResolverRuleId: Id })]);

const decorate =
  ({ config }) =>
  ({ endpoint }) =>
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
    decorate: decorate({ config }),
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverRule = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    cannotBeDeleted: cannotBeDeleted,
    managedByOther: cannotBeDeleted,
    findName: () => pipe([get("Name")]),
    findId: () => pipe([get("Arn")]),
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
