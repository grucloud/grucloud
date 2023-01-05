const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map, omit } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  cloudWatchLogGroupsDeps,
  firehoseDeliveryStreamsDeps,
} = require("./ElastiCacheCommon");

const pickId = pipe([pick(["CacheClusterId"])]);
const buildArn = () => pipe([get("ARN")]);

const decorate = ({ endpoint }) =>
  pipe([
    omitIfEmpty(["CacheSecurityGroups", "LogDeliveryConfigurations"]),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const managedByOther = () => pipe([get("ReplicationGroupId")]);

exports.ElastiCacheCacheCluster = () => ({
  type: "CacheCluster",
  package: "elasticache",
  client: "ElastiCache",
  findName: () => pipe([get("CacheClusterId")]),
  findId: () => pipe([get("CacheClusterId")]),
  managedByOther,
  inferName: () => get("CacheClusterId"),
  propertiesDefault: {
    AutoMinorVersionUpgrade: true,
    AuthTokenEnabled: false,
    TransitEncryptionEnabled: false,
    AtRestEncryptionEnabled: false,
    ReplicationGroupLogDeliveryEnabled: false,
    IpDiscovery: "ipv4",
    NetworkType: "ipv4",
  },
  omitProperties: [
    "ARN",
    "SecurityGroups",
    "ClientDownloadLandingPage",
    "CacheClusterStatus",
    "PreferredOutpostArn",
    "CacheClusterCreateTime",
    "PendingModifiedValues",
    "NotificationConfiguration",
    "CacheNodes",
    "ReplicationGroupId",
    "AuthTokenLastModifiedDate",
    "CacheParameterGroup",
    "ConfigurationEndpoint",
  ],
  dependencies: {
    ...cloudWatchLogGroupsDeps,
    ...firehoseDeliveryStreamsDeps,
    parameterGroup: {
      type: "CacheParameterGroup",
      group: "ElastiCache",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("CacheParameterGroup.CacheParameterGroupName")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("SecurityGroups"), pluck("SecurityGroupId")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        get("NotificationConfiguration.TopicArn"),
    },
    subnetGroup: {
      type: "CacheSubnetGroup",
      group: "ElastiCache",
      dependencyId: ({ lives, config }) => get("CacheSubnetGroupName"),
    },
  },

  filterLive: () =>
    pipe([
      when(
        eq(get("SnapshotRetentionLimit"), 0),
        omit(["SnapshotRetentionLimit"])
      ),
    ]),
  ignoreErrorCodes: ["CacheClusterNotFound", "CacheClusterNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeCacheClusters-property
  getById: {
    method: "describeCacheClusters",
    getField: "CacheClusters",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeCacheClusters-property
  getList: {
    method: "describeCacheClusters",
    getParam: "CacheClusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createCacheCluster-property
  create: {
    method: "createCacheCluster",
    pickCreated: ({ payload }) => pipe([get("CacheCluster")]),
    isInstanceUp: pipe([eq(get("CacheClusterStatus"), "available")]),
    postCreate: ({ endpoint, payload: { Tags } }) =>
      pipe([
        buildArn(),
        (ResourceName) => ({ ResourceName, Tags }),
        endpoint().addTagsToResource,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#modifyCacheCluster-property
  update: {
    method: "modifyCacheCluster",
    // TODO
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteCacheCluster-property
  destroy: {
    method: "deleteCacheCluster",
    pickId,
    shouldRetryOnExceptionCodes: ["InvalidCacheClusterStateFault"],
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
    dependencies: { securityGroups, snsTopic },
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
          SecurityGroups: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ]),
        })
      ),
    ])(),
});
