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
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "Evidently::Project",
        livesNotFound: ({ config }) => [{}],
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
