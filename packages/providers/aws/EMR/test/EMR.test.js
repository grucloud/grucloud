const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EMR", async function () {
  it.skip("BlockPublicAccessConfiguration", () =>
    pipe([
      () => ({
        groupType: "EMR::BlockPublicAccessConfiguration",
        livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipGetById: true,
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "EMR::Cluster",
        livesNotFound: ({ config }) => [
          {
            ClusterId: "j-O4K5N4IU33KA",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Studio", () =>
    pipe([
      () => ({
        groupType: "EMR::Studio",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
