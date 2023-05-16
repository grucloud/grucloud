const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MemoryDB", async function () {
  it("ACL", () =>
    pipe([
      () => ({
        groupType: "MemoryDB::ACL",
        livesNotFound: ({ config }) => [{ Name: "acl-12345" }],
      }),
      awsResourceTest,
    ])());
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "MemoryDB::Cluster",
        livesNotFound: ({ config }) => [{ Name: "cluster-12345" }],
      }),
      awsResourceTest,
    ])());
  it("ParameterGroup", () =>
    pipe([
      () => ({
        groupType: "MemoryDB::ParameterGroup",
        livesNotFound: ({ config }) => [
          { ParameterGroupName: "parameterGroup-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Snapshot", () =>
    pipe([
      () => ({
        groupType: "MemoryDB::Snapshot",
        livesNotFound: ({ config }) => [{ Name: "subnetGroup-12345" }],
      }),
      awsResourceTest,
    ])());
  it("SubnetGroup", () =>
    pipe([
      () => ({
        groupType: "MemoryDB::SubnetGroup",
        livesNotFound: ({ config }) => [{ Name: "subnetGroup-12345" }],
      }),
      awsResourceTest,
    ])());
  it("User", () =>
    pipe([
      () => ({
        groupType: "MemoryDB::User",
        livesNotFound: ({ config }) => [{ Name: "user-12345" }],
      }),
      awsResourceTest,
    ])());
});
