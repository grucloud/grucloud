const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./ElastiCacheCommon");

const pickId = pipe([pick(["CacheClusterId"])]);
const buildArn = () => pipe([get("ARN")]);

const decorate = ({ endpoint }) =>
  pipe([
    omitIfEmpty(["CacheSecurityGroups", "LogDeliveryConfigurations"]),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const managedByOther = () => pipe([get("ReplicationGroupId")]);

const model = ({ config }) => ({
  package: "elasticache",
  client: "ElastiCache",
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
  },
});

exports.ElastiCacheCacheCluster = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("CacheClusterId")]),
    findId: () => pipe([get("CacheClusterId")]),
    managedByOther,
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
      dependencies: { securityGroups, snsTopic },
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
