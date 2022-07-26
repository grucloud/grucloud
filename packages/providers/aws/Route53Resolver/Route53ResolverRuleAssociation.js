const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const cannotBeDeleted =
  ({ config }) =>
  ({ live, lives }) =>
    pipe([
      () =>
        lives.getByType({
          type: "Rule",
          group: "Route53Resolver",
          providerName: config.providerName,
        }),
      find(eq(get("live.Id"), live.ResolverRuleId)),
      get("cannotBeDeleted"),
    ])();

const model = ({ config }) => ({
  package: "route53resolver",
  client: "Route53Resolver",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverRuleAssociation-property
  getById: {
    method: "getResolverRuleAssociation",
    getField: "ResolverRuleAssociation",
    pickId: pipe([({ Id }) => ({ ResolverRuleAssociationId: Id })]),
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
    pickId: pipe([pick(["VPCId", "ResolverRuleId"])]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverRuleAssociation = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    cannotBeDeleted: cannotBeDeleted({ config }),
    managedByOther: cannotBeDeleted({ config }),
    findName: ({ live, lives }) =>
      pipe([
        () => live,
        fork({
          vpcName: pipe([
            () =>
              lives.getById({
                id: live.VPCId,
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
            get("name", live.VPCId),
          ]),
          ruleName: pipe([
            () =>
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
    findId: pipe([get("live.Id")]),
    getByName: ({ getList, endpoint }) =>
      pipe([
        ({ name }) => ({
          Filters: [{ Name: "Name", Values: [name] }],
        }),
        getList,
        first,
      ]),
    configDefault: ({
      name,
      namespace,
      properties,
      dependencies: { resolverRule, vpc },
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
