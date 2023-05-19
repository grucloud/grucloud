const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodePipeline", async function () {
  it("CustomActionType", () =>
    pipe([
      () => ({
        groupType: "CodePipeline::CustomActionType",
        livesNotFound: ({ config }) => [
          { category: "Source", provider: "p123", version: "1" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Pipeline", () =>
    pipe([
      () => ({
        groupType: "CodePipeline::Pipeline",
        livesNotFound: ({ config }) => [{ pipeline: { name: "123" } }],
      }),
      awsResourceTest,
    ])());
  it.skip("Webhook", () =>
    pipe([
      () => ({
        groupType: "CodePipeline::Webhook",
        livesNotFound: ({ config }) => [{ pipeline: { name: "123" } }],
      }),
      awsResourceTest,
    ])());
});
