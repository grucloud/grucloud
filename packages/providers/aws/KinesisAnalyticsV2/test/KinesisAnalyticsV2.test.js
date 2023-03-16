const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("KinesisAnalyticsV2", async function () {
  it.skip("Stream", () =>
    pipe([
      () => ({
        groupType: "KinesisAnalyticsV2::Application",
        livesNotFound: ({ config }) => [
          {
            //StreamName: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("StreamConsumer", () =>
    pipe([
      () => ({
        groupType: "KinesisAnalyticsV2::ApplicationSnapshot",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
