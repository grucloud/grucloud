const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaConvert"] });

describe("MediaConvert", async function () {
  it.skip("Queue", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConvert::Queue",
        livesNotFound: ({ config }) => [{ Name: "n123" }],
      }),
      awsResourceTest,
    ])());
});
