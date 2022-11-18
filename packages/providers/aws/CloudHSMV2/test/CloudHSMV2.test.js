const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudHSMV2", async function () {
  it.skip("Cluster", () =>
    pipe([
      () => ({
        groupType: "CloudHSMV2::Cluster",
        livesNotFound: ({ config }) => [{}],
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
