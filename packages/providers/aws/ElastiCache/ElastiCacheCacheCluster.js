const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");
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

const model = ({ config }) => ({
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["CacheClusterNotFound"],
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
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("CacheClusterStatus"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#modifyCacheCluster-property
  update: {
    method: "modifyCacheCluster",
    // TODO
    filterParams: ({ payload }) => pipe[() => payload],
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
    findName: pipe([get("live.CacheClusterId")]),
    findId: pipe([get("live.CacheClusterId")]),
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
      dependencies: {
        //TODO
        cloudWatchLogGroup,
        firehoseDeliveryStream,
        securityGroups,
        snsTopic,
        subnetGroup,
      },
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
          () => subnetGroup,
          assign({
            SubnetGroupName: () => subnetGroup.config.Name,
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
