const assert = require("assert");
const { tap, pipe, map, get, omit, eq, assign } = require("rubico");
const { defaultsDeep, when, pluck, first, size } = require("rubico/x");

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
const {
  ElastiCacheReplicationGroup,
} = require("./ElastiCacheReplicationGroup");

const GROUP = "ElastiCache";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const cloudWatchLogGroupsDeps = {
  cloudWatchLogGroups: {
    type: "LogGroup",
    group: "CloudWatchLogs",
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        get("LogDeliveryConfigurations"),
        map(
          pipe([
            get("DestinationDetails.CloudWatchLogsDetails.LogGroup"),
            (name) =>
              lives.getByName({
                name,
                providerName: config.providerName,
                type: "LogGroup",
                group: "CloudWatchLogs",
              }),
            get("id"),
          ])
        ),
      ]),
  },
};

module.exports = pipe([
  () => [
    {
      type: "CacheCluster",
      Client: ElastiCacheCacheCluster,
      propertiesDefault: {
        AutoMinorVersionUpgrade: true,
        AuthTokenEnabled: false,
        TransitEncryptionEnabled: false,
        AtRestEncryptionEnabled: false,
        ReplicationGroupLogDeliveryEnabled: false,
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
      inferName: get("properties.CacheClusterId"),
      dependencies: {
        ...cloudWatchLogGroupsDeps,
        firehoseDeliveryStreams: {
          type: "DeliveryStream",
          group: "Firehose",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("LogDeliveryConfigurations"),
              map(
                pipe([
                  get(
                    "DestinationDetails.KinesisFirehoseDetails.DeliveryStream"
                  ),
                ])
              ),
            ]),
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
          type: "CacheSubnetGroup",
          group: GROUP,
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
      type: "ReplicationGroup",
      Client: ElastiCacheReplicationGroup,
      propertiesDefault: {
        Engine: "redis",
        AuthTokenEnabled: false,
        TransitEncryptionEnabled: false,
        AtRestEncryptionEnabled: false,
        DataTiering: "disabled",
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
      ],
      inferName: get("properties.ReplicationGroupId"),
      //TODO check all deps
      dependencies: {
        ...cloudWatchLogGroupsDeps,
        firehoseDeliveryStreams: {
          type: "DeliveryStream",
          group: "Firehose",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("LogDeliveryConfigurations"),
              map(
                pipe([
                  get(
                    "DestinationDetails.KinesisFirehoseDetails.DeliveryStream"
                  ),
                ])
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
          group: GROUP,
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
          dependencyId: ({ lives, config }) =>
            get("NotificationConfiguration.TopicArn"),
        },
        subnetGroup: {
          type: "CacheSubnetGroup",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("CacheSubnetGroupName"),
        },
        userGroups: {
          type: "UserGroup",
          group: GROUP,
          list: true,
          dependencyIds: ({ lives, config }) => get("UserGroupIds"),
        },
      },
      compare: compareAws({
        filterTarget: () =>
          pipe([
            omit([
              "NumCacheClusters",
              "CacheParameterGroupName",
              "CacheSubnetGroupName",
            ]),
          ]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          when(
            eq(get("SnapshotRetentionLimit"), 0),
            omit(["SnapshotRetentionLimit"])
          ),
          assign({ NumCacheClusters: pipe([get("MemberClusters"), size]) }),
        ]),
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
          excludeDefaultDependencies: true,
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
