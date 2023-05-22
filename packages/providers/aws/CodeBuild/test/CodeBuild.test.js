const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeBuild", async function () {
  it("Project", () =>
    pipe([
      () => ({
        groupType: "CodeBuild::Project",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ReportGroup", () =>
    pipe([
      () => ({
        groupType: "CodeBuild::ReportGroup",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:codebuild:${
              config.region
            }:${config.accountId()}:report-group/r123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "CodeBuild::ResourcePolicy",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SourceCredential", () =>
    pipe([
      () => ({
        groupType: "CodeBuild::SourceCredential",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Webhook", () =>
    pipe([
      () => ({
        groupType: "CodeBuild::Webhook",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
