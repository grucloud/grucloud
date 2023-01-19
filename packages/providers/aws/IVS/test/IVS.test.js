const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["IVS"] });

describe("IVS", async function () {
  it("Channel", () =>
    pipe([
      () => ({
        config,
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
        config,
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
        config,
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
});
