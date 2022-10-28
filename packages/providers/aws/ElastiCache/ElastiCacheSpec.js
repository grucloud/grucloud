const assert = require("assert");
const { tap, pipe, map, get, omit, eq } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { ElastiCacheCacheCluster } = require("./ElastiCacheCacheCluster");

const {
  ElastiCacheCacheParameterGroup,
} = require("./ElastiCacheCacheParameterGroup");
const {
  ElastiCacheCacheSubnetGroup,
} = require("./ElastiCacheCacheSubnetGroup");

const { ElastiCacheUser } = require("./ElastiCacheUser");
const { ElastiCacheUserGroup } = require("./ElastiCacheUserGroup");

const GROUP = "ElastiCache";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    {
      type: "CacheCluster",
      Client: ElastiCacheCacheCluster,
      propertiesDefault: {
        AutoMinorVersionUpgrade: true,
        SnapshotRetentionLimit: 0,
        AuthTokenEnabled: false,
        TransitEncryptionEnabled: false,
        AtRestEncryptionEnabled: false,
        ReplicationGroupLogDeliveryEnabled: true,
      },
      omitProperties: [
        "ARN",
        "SecurityGroups",
        "ClientDownloadLandingPage",
        "CacheClusterStatus",
        "NumCacheNodes",
        "PreferredOutpostArn",
        "CacheClusterCreateTime",
        "PendingModifiedValues",
        "NotificationConfiguration",
        "CacheNodes",
        "ReplicationGroupId",
        "AuthTokenLastModifiedDate",
        "CacheParameterGroup",
      ],
      inferName: get("properties.CacheClusterId"),
      dependencies: {
        cloudWatchLogGroup: {
          type: "LogGroup",
          group: "CloudWatchLogs",
          dependencyId: ({ lives, config }) =>
            get(
              "LogDeliveryConfigurations.DestinationDetails.CloudWatchLogsDetails.LogGroup"
            ),
        },
        firehoseDeliveryStream: {
          type: "DeliveryStream",
          group: "Firehose",
          dependencyId: ({ lives, config }) =>
            get(
              "LogDeliveryConfigurations.DestinationDetails.KinesisFirehoseDetails.DeliveryStream"
            ),
        },
        parameterGroup: {
          type: "CacheParameterGroup",
          group: GROUP,
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
          type: "SubnetGroup",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("CacheSubnetGroupName"),
        },
      },
    },
    {
      type: "CacheParameterGroup",
      Client: ElastiCacheCacheParameterGroup,
      omitProperties: ["ARN", "IsGlobal"],
      inferName: get("properties.CacheParameterGroupName"),
    },
    {
      type: "CacheSubnetGroup",
      Client: ElastiCacheCacheSubnetGroup,
      omitProperties: ["ARN", "VpcId", "Subnets", "SubnetIds"],
      inferName: get("properties.CacheSubnetGroupName"),
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Subnets"), pluck("SubnetIdentifier")]),
        },
      },
    },
    {
      type: "User",
      Client: ElastiCacheUser,
      omitProperties: [
        "ARN",
        "Status",
        "UserGroupIds",
        "Authentication.PasswordCount",
        "MinimumEngineVersion",
      ],
      inferName: get("properties.UserName"),
      environmentVariables: [
        {
          path: "Authentication.Passwords",
          suffix: "ELASTICACHE_USER_PASSWORDS",
          array: true,
        },
      ],
      compare: compare({
        filterAll: () => pipe([omit(["Authentication"])]),
      }),
      filterLiveExtra: () =>
        pipe([
          when(
            eq(get("Authentication.Type"), "no-password"),
            omit(["Authentication"])
          ),
        ]),
    },
    {
      type: "UserGroup",
      Client: ElastiCacheUserGroup,
      omitProperties: [
        "ARN",
        "Status",
        "MinimumEngineVersion",
        "ReplicationGroups",
      ],
      inferName: get("properties.UserGroupId"),
      dependencies: {
        users: {
          type: "User",
          group: "ElastiCache",
          list: true,
          dependencyIds: () => pipe([get(["UserIds"])]),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
