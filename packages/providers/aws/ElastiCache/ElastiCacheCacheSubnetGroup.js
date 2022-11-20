const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map } = require("rubico");
const { defaultsDeep, callProp, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./ElastiCacheCommon");

const pickId = pipe([pick(["CacheSubnetGroupName"])]);
const buildArn = () => pipe([get("ARN")]);

const managedByOther = () => pipe([eq(get("CacheSubnetGroupName"), "default")]);

//
const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const model = ({ config }) => ({
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["CacheSubnetGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeCacheSubnetGroups-property
  getById: {
    method: "describeCacheSubnetGroups",
    getField: "CacheSubnetGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeCacheSubnetGroups-property
  getList: {
    method: "describeCacheSubnetGroups",
    getParam: "CacheSubnetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createCacheSubnetGroup-property
  create: {
    method: "createCacheSubnetGroup",
    pickCreated: ({ payload }) => pipe([get("CacheSubnetGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#modifyCacheSubnetGroup-property
  update: {
    method: "modifyCacheSubnetGroup",
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteCacheSubnetGroup-property
  destroy: {
    method: "deleteCacheSubnetGroup",
    pickId,
  },
});

exports.ElastiCacheCacheSubnetGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("CacheSubnetGroupName")]),
    findId: () => pipe([get("CacheSubnetGroupName")]),
    managedByOther,
    cannotBeDeleted: managedByOther,
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
      dependencies: { subnets },
    }) =>
      pipe([
        tap((params) => {
          assert(subnets);
        }),
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({
            name,
            config,
            namespace,
            UserTags: Tags,
          }),
        }),
        assign({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ]),
        }),
      ])(),
  });
