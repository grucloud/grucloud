const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, first, identity, find } = require("rubico/x");
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
      tap((params) => {
        assert(true);
      }),
    ])();

const model = ({ config }) => ({
  package: "route53resolver",
  client: "Route53Resolver",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverRuleAssociation-property
  getById: {
    method: "getResolverRuleAssociation",
    getField: "ResolverRuleAssociation",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
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
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#associateResolverRule-property
  create: {
    method: "associateResolverRule",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("ResolverRuleAssociation"),
      ]),
    isInstanceUp: pipe([eq(get("Status"), "COMPLETE")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED")]),
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
    findName: ({ live }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        //TODO match inferName
        () => live,
        get("Name", live.Id),
        tap((Name) => {
          assert(Name);
        }),
      ])(),
    findId: pipe([
      get("live.Id"),
      tap((Id) => {
        assert(Id);
      }),
    ]),
    findDependencies: ({ live, lives }) => [
      {
        type: "Rule",
        group: "Route53Resolver",
        ids: [
          pipe([
            () =>
              lives.getByType({
                type: "Rule",
                group: "Route53Resolver",
                providerName: config.providerName,
              }),
            find(eq(get("live.Id"), live.ResolverRuleId)),
            get("id"),
          ])(),
        ],
      },
      {
        type: "Vpc",
        group: "EC2",
        ids: [
          pipe([
            tap((params) => {
              assert(live.VPCId);
            }),
            () => live.VPCId,
          ])(),
        ],
      },
    ],
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
          Name: name,
          ResolverRuleId: getField(resolverRule, "Id"),
          VPCId: getField(vpc, "VpcId"),
        }),
      ])(),
  });
