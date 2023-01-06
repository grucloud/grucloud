const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("XRay", async function () {
  it.skip("EncryptionConfig", () =>
    pipe([
      () => ({
        groupType: "XRay::EncryptionConfig",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Group", () =>
    pipe([
      () => ({
        groupType: "XRay::Group ",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SamplingRule", () =>
    pipe([
      () => ({
        groupType: "XRay::SamplingRule",
        livesNotFound: ({ config }) => [{}],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
