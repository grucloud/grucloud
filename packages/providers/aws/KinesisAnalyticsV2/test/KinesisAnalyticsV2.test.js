const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("KinesisAnalyticsV2", async function () {
  it("Stream", () =>
    pipe([
      () => ({
        groupType: "KinesisAnalyticsV2::Application",
        livesNotFound: ({ config }) => [
          {
            ApplicationName: "a-12345",
            CreateTimestamp: new Date(),
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
