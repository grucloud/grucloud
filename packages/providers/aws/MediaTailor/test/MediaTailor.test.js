const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaTailor"] });

describe("MediaTailor", async function () {
  it("PlaybackConfiguration", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaTailor::PlaybackConfiguration",
        livesNotFound: ({ config }) => [{ Name: "n123" }],
      }),
      awsResourceTest,
    ])());
});
