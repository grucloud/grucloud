const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("IVS", async function () {
  it("Channel", () =>
    pipe([
      () => ({
        groupType: "IVS::Channel",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ivs:${
              config.region
            }:${config.accountId()}:channel/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("PlaybackKeyPair", () =>
    pipe([
      () => ({
        groupType: "IVS::PlaybackKeyPair",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ivs:${
              config.region
            }:${config.accountId()}:playbackkeypair/z1UlkAz4Rlt3`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RecordingConfiguration", () =>
    pipe([
      () => ({
        groupType: "IVS::RecordingConfiguration",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ivs:${
              config.region
            }:${config.accountId()}:recording-configuration/z1UlkAz4Rlt3`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  // it.skip("Room", () =>
  //   pipe([
  //     () => ({
  //       groupType: "IVS::Room",
  //       livesNotFound: ({ config }) => [{}],
  //     }),
  //     awsResourceTest,
  //   ])());
});
