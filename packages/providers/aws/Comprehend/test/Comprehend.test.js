const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["Comprehend"] });

describe("Comprehend", async function () {
  it.skip("Endpoint", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::Endpoint",
        livesNotFound: ({ config }) => [{ EndpointArn: "b123" }],
      }),
      awsResourceTest,
    ])());
});
