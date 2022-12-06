const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudHSMV2", async function () {
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "CloudHSMV2::Cluster",
        livesNotFound: ({ config }) => [{ ClusterId: "cluster-igklspoyj5v" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Hsm", () =>
    pipe([
      () => ({
        groupType: "CloudHSMV2::Hsm",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
