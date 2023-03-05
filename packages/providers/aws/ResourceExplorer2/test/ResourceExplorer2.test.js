const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ResourceExplorer2", async function () {
  it.skip("Index", () =>
    pipe([
      () => ({
        groupType: "ResourceExplorer2::Index",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("View", () =>
    pipe([
      () => ({
        groupType: "ResourceExplorer2::View",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
});
