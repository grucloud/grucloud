const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Evidently", async function () {
  it("Experiment", () =>
    pipe([
      () => ({
        groupType: "Evidently::Experiment",
        livesNotFound: ({ config }) => [{ project: "p123", name: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("Feature", () =>
    pipe([
      () => ({
        groupType: "Evidently::Feature",
        livesNotFound: ({ config }) => [{ project: "p123", name: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("Launch", () =>
    pipe([
      () => ({
        groupType: "Evidently::Launch",
        livesNotFound: ({ config }) => [{ project: "p123", name: "l123" }],
      }),
      awsResourceTest,
    ])());
  it("Project", () =>
    pipe([
      () => ({
        groupType: "Evidently::Project",
        livesNotFound: ({ config }) => [{ name: "p123" }],
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
