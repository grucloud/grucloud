const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("KinesisVideo", async function () {
  it("Stream", () =>
    pipe([
      () => ({
        groupType: "KinesisVideo::Stream",
        livesNotFound: ({ config }) => [
          {
            // arn:aws:kinesisvideo:us-east-1:840541460064:stream/input-video-stream/1676469240353
            StreamARN: `arn:${config.partition}:kinesisvideo:${
              config.region
            }:${config.accountId()}:stream/input-video-stream/1676469240352`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SignalingChannel", () =>
    pipe([
      () => ({
        groupType: "SignalingChannel::Stream",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  //
});
