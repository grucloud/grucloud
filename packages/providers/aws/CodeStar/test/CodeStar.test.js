const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeStar", async function () {
  it("Project", () =>
    pipe([
      () => ({
        groupType: "CodeStar::Project",
        livesNotFound: ({ config }) => [
          {
            id: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
