const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DAX", async function () {
  it.skip("Cluster", () =>
    pipe([
      () => ({
        groupType: "DAX::Cluster",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ParameterGroup", () =>
    pipe([
      () => ({
        groupType: "DAX::ParameterGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SubnetGroup", () =>
    pipe([
      () => ({
        groupType: "DAX::SubnetGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
