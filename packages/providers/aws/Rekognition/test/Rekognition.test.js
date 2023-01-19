const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Rekognition", async function () {
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "Rekognition::Project",
        livesNotFound: ({ config }) => [{ ProjectArn: "e123" }],
      }),
      awsResourceTest,
    ])());
});
