const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ElastiCacheCommon");

const pickId = pipe([pick(["CacheSubnetGroupName"])]);
const buildArn = () => pipe([get("ARN")]);

const managedByOther = () => pipe([eq(get("CacheSubnetGroupName"), "default")]);

//
const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

exports.ElastiCacheCacheSubnetGroup = () => ({
  type: "CacheSubnetGroup",
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["CacheSubnetGroupNotFoundFault"],
  inferName: get("properties.CacheSubnetGroupName"),
  findName: () => pipe([get("CacheSubnetGroupName")]),
  findId: () => pipe([get("CacheSubnetGroupName")]),
  propertiesDefault: { SupportedNetworkTypes: ["ipv4"] },
  omitProperties: ["ARN", "VpcId", "Subnets", "SubnetIds"],
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Subnets"), pluck("SubnetIdentifier")]),
    },
  },
  managedByOther,
  cannotBeDeleted: managedByOther,
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
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets },
    config,
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
