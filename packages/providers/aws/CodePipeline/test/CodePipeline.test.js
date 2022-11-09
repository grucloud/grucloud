const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodePipeline", async function () {
  it("Pipeline", () =>
    pipe([
      () => ({
        groupType: "CodePipeline::Pipeline",
        livesNotFound: ({ config }) => [{ pipeline: { name: "123" } }],
      }),
      awsResourceTest,
    ])());
});
