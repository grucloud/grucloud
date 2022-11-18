const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ElastiCache", async function () {
  it("CacheCluster", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::CacheCluster",
        livesNotFound: ({ config }) => [
          {
            CacheClusterId: "cluster-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CacheParameterGroup", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::CacheParameterGroup",
        livesNotFound: ({ config }) => [
          {
            CacheParameterGroupName: "p-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CacheSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::CacheSubnetGroup",
        livesNotFound: ({ config }) => [
          {
            CacheSubnetGroupName: "s-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ReplicationGroup", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::ReplicationGroup",
        livesNotFound: ({ config }) => [
          {
            ReplicationGroupId: "r-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("GlobalReplicationGroup", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::GlobalReplicationGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("User", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::User",
        livesNotFound: ({ config }) => [
          {
            UserId: "user-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserGroup", () =>
    pipe([
      () => ({
        groupType: "ElastiCache::UserGroup",
        livesNotFound: ({ config }) => [
          {
            UserGroupId: "user-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
