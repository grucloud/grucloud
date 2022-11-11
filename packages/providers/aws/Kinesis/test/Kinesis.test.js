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
});
