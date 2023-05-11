const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeCatalyst", async function () {
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "CodeCatalyst::Project",
        livesNotFound: ({ config }) => [{ spaceName: "r123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Space", () =>
    pipe([
      () => ({
        groupType: "CodeCatalyst::Space",
        livesNotFound: ({ config }) => [{ name: "r123" }],
      }),
      awsResourceTest,
    ])());
});
