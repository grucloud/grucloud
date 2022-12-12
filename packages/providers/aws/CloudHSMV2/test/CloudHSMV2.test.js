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
  it("Hsm", () =>
    pipe([
      () => ({
        groupType: "CloudHSMV2::Hsm",
        livesNotFound: ({ config }) => [
          { ClusterId: "cluster-igklspoyj5a", HsmId: "hsm-jf7qzgpf5d2" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
