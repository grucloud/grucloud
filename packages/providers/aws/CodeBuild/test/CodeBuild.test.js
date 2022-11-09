const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeBuild", async function () {
  it("Project", () =>
    pipe([
      () => ({
        groupType: "CodeBuild::Project",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
