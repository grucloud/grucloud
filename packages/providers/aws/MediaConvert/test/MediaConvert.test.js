const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MediaConvert", async function () {
  it.skip("Queue", () =>
    pipe([
      () => ({
        groupType: "MediaConvert::Queue",
        livesNotFound: ({ config }) => [{ Name: "n123" }],
      }),
      awsResourceTest,
    ])());
});
