const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("OSIS", async function () {
  it("Pipeline", () =>
    pipe([
      () => ({
        groupType: "OSIS::Pipeline",
        livesNotFound: ({ config }) => [{ PipelineName: "p123" }],
      }),
      awsResourceTest,
    ])());
});
