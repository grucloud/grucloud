const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DAX", async function () {
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "DAX::Cluster",
        livesNotFound: ({ config }) => [{ ClusterName: "c123" }],
      }),
      awsResourceTest,
    ])());
  it("ParameterGroup", () =>
    pipe([
      () => ({
        groupType: "DAX::ParameterGroup",
        livesNotFound: ({ config }) => [{ ParameterGroupName: "p123" }],
      }),
      awsResourceTest,
    ])());
  it("SubnetGroup", () =>
    pipe([
      () => ({
        groupType: "DAX::SubnetGroup",
        livesNotFound: ({ config }) => [{ SubnetGroupName: "s123" }],
      }),
      awsResourceTest,
    ])());
});
