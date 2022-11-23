const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compare, tagsKey } = require("./ElastiCacheCommon");

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

module.exports = pipe([
  () => [
    ElastiCacheCacheCluster({}),
    ElastiCacheCacheParameterGroup({}),
    ElastiCacheCacheSubnetGroup({}),
    ElastiCacheReplicationGroup({}),
    ElastiCacheUser({}),
    ElastiCacheUserGroup({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
