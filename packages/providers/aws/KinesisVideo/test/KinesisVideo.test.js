const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("KinesisVideo", async function () {
  it.skip("Stream", () =>
    pipe([
      () => ({
        groupType: "KinesisVideo::Stream",
        livesNotFound: ({ config }) => [
          {
            StreamARN: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
