const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Evidently", async function () {
  it("Feature", () =>
    pipe([
      () => ({
        groupType: "Evidently::Feature",
        livesNotFound: ({ config }) => [{ project: "p123", feature: "f123" }],
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
  it("Segment", () =>
    pipe([
      () => ({
        groupType: "Evidently::Segment",
        livesNotFound: ({ config }) => [{ segment: "s123" }],
      }),
      awsResourceTest,
    ])());
});
