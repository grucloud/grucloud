const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaConvert"] });

describe("MediaConvert", async function () {
  it.skip("JobTemplate", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConvert::JobTemplate",
        livesNotFound: ({ config }) => [{ Name: "n123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Preset", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConvert::Preset",
        livesNotFound: ({ config }) => [{ Name: "n123" }],
      }),
      awsResourceTest,
    ])());
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
