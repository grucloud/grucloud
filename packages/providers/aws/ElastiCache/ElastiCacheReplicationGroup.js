const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map, omit } = require("rubico");
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
          omitIfEmpty([
            "GlobalReplicationGroupInfo.GlobalReplicationGroupId",
            "GlobalReplicationGroupInfo.GlobalReplicationGroupMemberRole",
          ]),
          omitIfEmpty(["GlobalReplicationGroupInfo", "NotificationTopicArn"]),
          ({ Description, ...other }) => ({
            ReplicationGroupDescription: Description,
            ...other,
          }),
          assignTags({ endpoint, buildArn: buildArn() }),
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
    Engine: "redis",
    AuthTokenEnabled: false,
    TransitEncryptionEnabled: false,
    AtRestEncryptionEnabled: false,
    DataTiering: "disabled",
    IpDiscovery: "ipv4",
    NetworkType: "ipv4",
    AutoMinorVersionUpgrade: true,
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
  ],
  inferName: () => get("ReplicationGroupId"),
  //TODO check all deps
  dependencies: {
    ...cloudWatchLogGroupsDeps,
    ...firehoseDeliveryStreamsDeps,
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
        pipe([get("CacheParameterGroupName")]),
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
    method: "deleteReplicationGroup",
    pickId,
    shouldRetryOnExceptionCodes: ["InvalidReplicationGroupStateFault"],
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
    dependencies: { kmsKey, securityGroups, snsTopic },
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
