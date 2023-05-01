const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  assign,
  map,
  omit,
  not,
  tryCatch,
} = require("rubico");
const { defaultsDeep, when, first, pluck, size } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const {
  compare,
  Tagger,
  assignTags,
  cloudWatchLogGroupsDeps,
  firehoseDeliveryStreamsDeps,
} = require("./ElastiCacheCommon");

const omitIfFalse = (prop) => when(eq(get(prop), false), omit([prop]));

const pickId = pipe([
  pick(["ReplicationGroupId"]),
  tap(({ ReplicationGroupId }) => {
    assert(ReplicationGroupId);
  }),
]);
const buildArn = () => pipe([get("ARN")]);

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      get("MemberClusters"),
      first,
      (CacheClusterId) => ({ CacheClusterId }),
      endpoint().describeCacheClusters,
      get("CacheClusters"),
      first,
      (cluster) =>
        pipe([
          () => live,
          assign({
            CacheParameterGroupName: pipe([
              () => cluster,
              get("CacheParameterGroup.CacheParameterGroupName"),
            ]),
            CacheSubnetGroupName: pipe([
              () => cluster,
              get("CacheSubnetGroupName"),
            ]),
            SecurityGroupIds: pipe([
              () => cluster,
              get("SecurityGroups"),
              pluck("SecurityGroupId"),
            ]),
          }),
          assign({
            NotificationTopicArn: pipe([
              () => cluster,
              get("NotificationConfiguration.TopicArn"),
            ]),
          }),
          ({ Description, GlobalReplicationGroupInfo, ...other }) => ({
            ReplicationGroupDescription: Description.trim(),
            ...GlobalReplicationGroupInfo,
            ...other,
          }),
          omitIfEmpty(["NotificationTopicArn"]),
          omitIfEmpty([
            "ReplicationGroupDescription",
            "GlobalReplicationGroupId",
            "GlobalReplicationGroupMemberRole",
            "LogDeliveryConfigurations",
          ]),
          assignTags({ endpoint, buildArn: buildArn() }),
          omitIfFalse("AtRestEncryptionEnabled"),
          omitIfFalse("AuthTokenEnabled"),
          omitIfFalse("TransitEncryptionEnabled"),
        ])(),
    ])();

exports.ElastiCacheReplicationGroup = () => ({
  type: "ReplicationGroup",
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["ReplicationGroupNotFoundFault"],
  findName: () => pipe([get("ReplicationGroupId")]),
  findId: () => pipe([get("ReplicationGroupId")]),
  propertiesDefault: {
    DataTiering: "disabled",
    IpDiscovery: "ipv4",
    NetworkType: "ipv4",
    Engine: "redis",
  },
  omitProperties: [
    "ARN",
    "AutomaticFailover",
    "SecurityGroups",
    "Status",
    "SnapshottingClusterId",
    "LogDeliveryConfigurations[].Status",
    "LogDeliveryConfigurations[].Message",
    "NodeGroups",
    "MemberClusters",
    "PendingModifiedValues",
    "ReplicationGroupCreateTime",
    "MemberClustersOutpostArns",
    "SecurityGroupIds",
    "KmsKeyId",
    "NotificationTopicArn",
    "MultiAZ",
    "SnapshotRetentionLimit",
    "GlobalReplicationGroupId",
    "GlobalReplicationGroupMemberRole",
  ],
  inferName: () => get("ReplicationGroupId"),
  //TODO check all deps
  dependencies: {
    ...cloudWatchLogGroupsDeps,
    ...firehoseDeliveryStreamsDeps,
    globalReplicationGroup: {
      type: "GlobalReplicationGroup",
      group: "ElastiCache",
      dependencyId: ({ lives, config }) =>
        pipe([
          when(
            eq(get("GlobalReplicationGroupMemberRole"), "SECONDARY"),
            get("GlobalReplicationGroupId")
          ),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => pipe([get("KmsKeyId")]),
    },
    parameterGroup: {
      type: "CacheParameterGroup",
      group: "ElastiCache",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          when(
            not(eq(get("GlobalReplicationGroupMemberRole"), "SECONDARY")),
            get("CacheParameterGroupName")
          ),
        ]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("SecurityGroupIds")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => get("NotificationTopicArn"),
    },
    subnetGroup: {
      type: "CacheSubnetGroup",
      group: "ElastiCache",
      dependencyId: ({ lives, config }) => get("CacheSubnetGroupName"),
    },
    userGroups: {
      type: "UserGroup",
      group: "ElastiCache",
      list: true,
      dependencyIds: ({ lives, config }) => get("UserGroupIds"),
    },
  },
  compare: compare({
    filterTarget: () => pipe([omit(["NumCacheClusters"])]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        eq(get("SnapshotRetentionLimit"), 0),
        omit(["SnapshotRetentionLimit"])
      ),
      when(
        eq(get("GlobalReplicationGroupMemberRole"), "SECONDARY"),
        omit([
          "CacheParameterGroupName",
          "CacheNodeType",
          "AutoMinorVersionUpgrade",
        ])
      ),
      assign({ NumCacheClusters: pipe([get("MemberClusters"), size]) }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeReplicationGroups-property
  getById: {
    method: "describeReplicationGroups",
    getField: "ReplicationGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeReplicationGroups-property
  getList: {
    method: "describeReplicationGroups",
    getParam: "ReplicationGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createReplicationGroup-property
  create: {
    method: "createReplicationGroup",
    pickCreated: ({ payload }) => pipe([get("ReplicationGroup")]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
    postCreate: ({ endpoint, payload: { Tags } }) =>
      pipe([
        buildArn(),
        (ResourceName) => ({ ResourceName, Tags }),
        endpoint().addTagsToResource,
      ]),
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#modifyReplicationGroup-property
  update: {
    method: "modifyReplicationGroup",
    // TODO
    filterParams: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
        //TODO use UserGroupIdsToAdd and UserGroupIdsToRemove
        omit(["UserGroupIds", "Tags"]),
        defaultsDeep({ ApplyImmediately: true }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteReplicationGroup-property
  destroy: {
    preDestroy: ({ endpoint, config }) =>
      tap(
        pipe([
          when(
            eq(get("GlobalReplicationGroupMemberRole"), "SECONDARY"),
            pipe([
              pick(["ReplicationGroupId", "GlobalReplicationGroupId"]),
              defaultsDeep({
                ReplicationGroupRegion: config.region,
              }),
              tryCatch(
                endpoint().disassociateGlobalReplicationGroup,
                (error) => {
                  assert(true);
                }
              ),
            ])
          ),
        ])
      ),
    method: "deleteReplicationGroup",
    pickId,
    shouldRetryOnExceptionCodes: ["InvalidReplicationGroupStateFault"],
    shouldRetryOnExceptionMessages: [
      "is part of a global cluster",
      "Global Replication Group is not in a valid state to perform this operation",
    ],
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
    dependencies: { globalReplicationGroup, kmsKey, securityGroups, snsTopic },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(true);
      }),
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      when(
        () => globalReplicationGroup,
        assign({
          GlobalReplicationGroupId: pipe([
            () => getField(globalReplicationGroup, "GlobalReplicationGroupId"),
          ]),
        })
      ),
      when(
        () => kmsKey,
        assign({
          KmsKeyId: pipe([() => getField(kmsKey, "Arn")]),
        })
      ),
      when(
        () => snsTopic,
        assign({
          NotificationTopicArn: pipe([
            () => getField(snsTopic, "Attributes.TopicArn"),
          ]),
        })
      ),
      when(
        () => securityGroups,
        assign({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ]),
        })
      ),
    ])(),
});
