const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Kinesis", async function () {
  it("Stream", () =>
    pipe([
      () => ({
        groupType: "Kinesis::Stream",
        livesNotFound: ({ config }) => [
          {
            StreamName: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("StreamConsumer", () =>
    pipe([
      () => ({
        groupType: "Kinesis::StreamConsumer",
        livesNotFound: ({ config }) => [
          {
            StreamARN: `arn:${config.partition}:kinesis:${
              config.region
            }:${config.accountId()}:stream/32no4tl70Fmr`,
            ConsumerARN: `arn:${config.partition}:kinesis:${
              config.region
            }:${config.accountId()}:stream/32no4tl70Fmr/consumer/123456789:1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
