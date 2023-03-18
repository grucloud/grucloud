const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Rbin", async function () {
  it("Rule", () =>
    pipe([
      () => ({
        groupType: "Rbin::Rule",
        livesNotFound: ({ config }) => [
          {
            Identifier: "12345678901",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
