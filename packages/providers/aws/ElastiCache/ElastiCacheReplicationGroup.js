const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map, omit } = require("rubico");
const { defaultsDeep, when, identity, first, pluck } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
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

const model = ({ config }) => ({
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["ReplicationGroupNotFoundFault"],
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
  },
});

exports.ElastiCacheReplicationGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ReplicationGroupId")]),
    findId: pipe([get("live.ReplicationGroupId")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { kmsKey, securityGroups, snsTopic },
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
