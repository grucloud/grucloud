const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ElasticTranscoder", async function () {
  it.skip("Pipeline", () =>
    pipe([
      () => ({
        groupType: "ElasticTranscoder::Pipeline",
        livesNotFound: ({ config }) => [
          {
            Id: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Preset", () =>
    pipe([
      () => ({
        groupType: "ElasticTranscoder::Preset",
        livesNotFound: ({ config }) => [
          {
            Id: "i123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
