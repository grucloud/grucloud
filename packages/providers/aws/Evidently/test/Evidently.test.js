const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Evidently", async function () {
  it.skip("Feature", () =>
    pipe([
      () => ({
        groupType: "Evidently::Feature",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Project", () =>
    pipe([
      () => ({
        groupType: "Evidently::Project",
        livesNotFound: ({ config }) => [{ project: "p123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Segment", () =>
    pipe([
      () => ({
        groupType: "Evidently::Segment",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
