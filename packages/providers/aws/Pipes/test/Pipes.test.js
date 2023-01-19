const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Pipes", async function () {
  it.skip("Pipe", () =>
    pipe([
      () => ({
        groupType: "Pipes::Pipe",
        livesNotFound: ({ config }) => [{ Name: "123456789012" }],
      }),
      awsResourceTest,
    ])());
});
