const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DataBrew", async function () {
  it.skip("DataSet", () =>
    pipe([
      () => ({
        groupType: "DataBrew::DataSet",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Job", () =>
    pipe([
      () => ({
        groupType: "DataBrew::Job",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "DataBrew::Project",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Recipe", () =>
    pipe([
      () => ({
        groupType: "DataBrew::Recipe",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("RuleSet", () =>
    pipe([
      () => ({
        groupType: "DataBrew::RuleSet",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Schedule", () =>
    pipe([
      () => ({
        groupType: "DataBrew::Schedule",
        livesNotFound: ({ config }) => [{ ReportName: "b123" }],
      }),
      awsResourceTest,
    ])());
});
