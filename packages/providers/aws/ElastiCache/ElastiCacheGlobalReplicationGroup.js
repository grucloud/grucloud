const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, and, not, omit } = require("rubico");
const {
  defaultsDeep,
  find,
  isEmpty,
  unless,
  callProp,
  isIn,
} = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ GlobalReplicationGroupId }) => {
    assert(GlobalReplicationGroupId);
  }),
  pick(["GlobalReplicationGroupId"]),
]);

const managedByOther = ({ lives, config }) =>
  pipe([
    tap((params) => {
      assert(config.region);
    }),
    not(get("PrimaryReplicationGroupId")),
  ]);

const decorate = ({ endpoint, config, lives }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(config);
      assert(lives);
    }),
    assign({
      GlobalReplicationGroupIdSuffix: pipe([
        get("GlobalReplicationGroupId"),
        callProp("split", "-"),
        ([prefix, ...other]) => other,
        callProp("join", "-"),
      ]),
    }),
    assign({
      GlobalReplicationGroupDescription: pipe([
        get("GlobalReplicationGroupDescription"),
        callProp("trim"),
      ]),
    }),
    omitIfEmpty(["GlobalReplicationGroupDescription"]),
    assign({
      PrimaryReplicationGroupId: ({ GlobalReplicationGroupId }) =>
        pipe([
          lives.getByType({
            type: "ReplicationGroup",
            group: "ElastiCache",
            providerName: config.providerName,
          }),
          find(
            and([
              eq(
                get("live.GlobalReplicationGroupId"),
                GlobalReplicationGroupId
              ),
              eq(get("live.GlobalReplicationGroupMemberRole"), "PRIMARY"),
            ])
          ),
          get("id"),
        ])(),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html
exports.ElastiCacheGlobalReplicationGroup = () => ({
  type: "GlobalReplicationGroup",
  package: "elasticache",
  client: "ElastiCache",
  propertiesDefault: {},
  omitProperties: [
    "GlobalReplicationGroupId",
    "PrimaryReplicationGroupId",
    "Status",
    "Engine",
    "EngineVersion",
    "Members",
    "AuthTokenEnabled",
    "GlobalNodeGroups",
    "ClusterEnabled",
    "TransitEncryptionEnabled",
    "AtRestEncryptionEnabled",
    "ARN",
  ],
  inferName: () =>
    pipe([
      get("GlobalReplicationGroupIdSuffix"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("GlobalReplicationGroupIdSuffix"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GlobalReplicationGroupId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    primaryReplicationGroup: {
      type: "ReplicationGroup",
      group: "ElastiCache",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("PrimaryReplicationGroupId")]),
    },
  },
  ignoreErrorCodes: ["GlobalReplicationGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#getGlobalReplicationGroup-property
  getById: {
    method: "describeGlobalReplicationGroups",
    getField: "GlobalReplicationGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#listGlobalReplicationGroups-property
  getList: {
    method: "describeGlobalReplicationGroups",
    getParam: "GlobalReplicationGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createGlobalReplicationGroup-property
  create: {
    method: "createGlobalReplicationGroup",
    pickCreated: ({ payload }) => pipe([get("GlobalReplicationGroup")]),
    isInstanceUp: pipe([get("Status"), isIn(["primary-only", "available"])]),
    // isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    shouldRetryOnExceptionMessages: [
      "Replication Group is not in a valid state",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#updateGlobalReplicationGroup-property
  update: {
    method: "updateGlobalReplicationGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteGlobalReplicationGroup-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap((live) =>
        pipe([
          // TODO Members is not present
          () => live,
          get("Members"),
          find(eq(get("Role"), "SECONDARY")),
          unless(
            isEmpty,
            pipe([
              pick(["ReplicationGroupId", "ReplicationGroupRegion"]),
              defaultsDeep({
                GlobalReplicationGroupId: live.GlobalReplicationGroupId,
              }),
              endpoint().disassociateGlobalReplicationGroup,
            ])
          ),
        ])()
      ),
    method: "deleteGlobalReplicationGroup",
    pickId: pipe([
      pickId,
      defaultsDeep({ RetainPrimaryReplicationGroup: true }),
    ]),
    shouldRetryOnExceptionCodes: ["InvalidGlobalReplicationGroupStateFault"],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { primaryReplicationGroup },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(primaryReplicationGroup);
      }),
      () => otherProps,
      defaultsDeep({
        PrimaryReplicationGroupId: getField(
          primaryReplicationGroup,
          "ReplicationGroupId"
        ),
      }),
    ])(),
});
