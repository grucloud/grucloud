const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeCommit", async function () {
  it("Repository", () =>
    pipe([
      () => ({
        groupType: "CodeCommit::Repository",
        livesNotFound: ({ config }) => [{ repositoryName: "r123" }],
      }),
      awsResourceTest,
    ])());
});
