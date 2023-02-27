const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ResourceGroups", async function () {
  it.skip("Group", () =>
    pipe([
      () => ({
        groupType: "ResourceGroups::Group",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
});
