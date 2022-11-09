const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Glue", async function () {
  it("Job", () =>
    pipe([
      () => ({
        groupType: "Glue::Job",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
