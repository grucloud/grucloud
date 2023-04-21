const assert = require("assert");
const { pipe, tap, get, pick, fork } = require("rubico");
const { defaultsDeep, isIn, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const toResolverQueryLogConfigAssociationId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id, ...other }) => ({
    ResolverQueryLogConfigAssociationId: Id,
    ...other,
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toResolverQueryLogConfigAssociationId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverQueryLogConfigAssociation = () => ({
  type: "QueryLogConfigAssociation",
  package: "route53resolver",
  client: "Route53Resolver",
  propertiesDefault: {},
  omitProperties: [
    "ResolverQueryLogConfigAssociationId",
    "ResolverQueryLogConfigId",
    "ResourceId",
    "DestinationArn",
    "CreatorRequestId",
    "CreationTime",
    "Status",
    "Error",
    "ErrorMessage",
  ],
  inferName:
    ({ dependenciesSpec: { queryLogConfig, vpc } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(queryLogConfig);
          assert(vpc);
        }),
        () => `${queryLogConfig}::${vpc}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          vpc: pipe([
            get("ResourceId"),
            lives.getById({
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name", live.ResourceId),
          ]),
          queryLogConfig: pipe([
            get("ResolverQueryLogConfigId"),
            lives.getById({
              type: "QueryLogConfig",
              group: "Route53Resolver",
              providerName: config.providerName,
            }),
            get("name", live.ResolverQueryLogConfigId),
          ]),
        }),
        tap(({ queryLogConfig, vpc }) => {
          assert(queryLogConfig);
          assert(vpc);
        }),
        ({ queryLogConfig, vpc }) => `${queryLogConfig}::${vpc}`,
      ])(),
  findId: () =>
    pipe([
      get("ResolverQueryLogConfigAssociationId"),
      tap((ResolverQueryLogConfigAssociationId) => {
        assert(ResolverQueryLogConfigAssociationId);
      }),
    ]),
  dependencies: {
    queryLogConfig: {
      type: "QueryLogConfig",
      group: "Route53Resolver",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResolverQueryLogConfigId"),
          tap((ResolverQueryLogConfigId) => {
            assert(ResolverQueryLogConfigId);
          }),
        ]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResourceId"),
          tap((ResourceId) => {
            assert(ResourceId);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverQueryLogConfigAssociation-property
  getById: {
    method: "getResolverQueryLogConfigAssociation",
    getField: "ResolverQueryLogConfigAssociation",
    pickId: pipe([
      tap(({ ResolverQueryLogConfigAssociationId }) => {
        assert(ResolverQueryLogConfigAssociationId);
      }),
      pick(["ResolverQueryLogConfigAssociationId"]),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverQueryLogConfigs-property
  getList: {
    method: "listResolverQueryLogConfigAssociations",
    getParam: "ResolverQueryLogConfigAssociations",
    decorate: ({ getById }) =>
      pipe([toResolverQueryLogConfigAssociationId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#associateResolverQueryLogConfig-property
  create: {
    method: "associateResolverQueryLogConfig",
    pickCreated: ({ payload }) =>
      pipe([
        get("ResolverQueryLogConfigAssociation"),
        toResolverQueryLogConfigAssociationId,
      ]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("ErrorMessage", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateQueryLogConfig-property
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#disassociateResolverQueryLogConfig-property
  destroy: {
    method: "disassociateResolverQueryLogConfig",
    pickId: pipe([
      tap(({ ResolverQueryLogConfigId, ResourceId }) => {
        assert(ResolverQueryLogConfigId);
        assert(ResourceId);
      }),
      pick(["ResolverQueryLogConfigId", "ResourceId"]),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { queryLogConfig, vpc },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(queryLogConfig);
        assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        ResolverQueryLogConfigId: getField(
          queryLogConfig,
          "ResolverQueryLogConfigId"
        ),
        ResourceId: getField(vpc, "VpcId"),
      }),
    ])(),
});
