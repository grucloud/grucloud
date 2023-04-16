const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MWAA", async function () {
  it("Environment", () =>
    pipe([
      () => ({
        groupType: "MWAA::Environment",
        livesNotFound: ({ config }) => [
          {
            Name: "env",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
