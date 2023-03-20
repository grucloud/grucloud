const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Rekognition", async function () {
  it.skip("Collection", () =>
    pipe([
      () => ({
        groupType: "Rekognition::Collection",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "Rekognition::Project",
        livesNotFound: ({ config }) => [{ ProjectArn: "e123" }],
      }),
      awsResourceTest,
    ])());
  it("StreamProcessor", () =>
    pipe([
      () => ({
        groupType: "Rekognition::StreamProcessor",
        livesNotFound: ({ config }) => [
          {
            Name: "s123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
