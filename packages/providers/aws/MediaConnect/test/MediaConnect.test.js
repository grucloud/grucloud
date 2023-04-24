const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaConnect"] });

describe("MediaConnect", async function () {
  it.skip("Bridge", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConnect::Bridge",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Flow", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConnect::Flow",
        livesNotFound: ({ config }) => [{ FlowArn: "n123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Gateway", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConnect::Gateway",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
