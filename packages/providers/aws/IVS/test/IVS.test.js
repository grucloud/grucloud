const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("IVS", async function () {
  it.skip("Channel", () =>
    pipe([
      () => ({
        groupType: "IVS::Channel",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PlaybackKeyPair", () =>
    pipe([
      () => ({
        groupType: "IVS::PlaybackKeyPair",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("RecordingConfiguration", () =>
    pipe([
      () => ({
        groupType: "IVS::RecordingConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("StreamKey", () =>
    pipe([
      () => ({
        groupType: "IVS::StreamKey",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
