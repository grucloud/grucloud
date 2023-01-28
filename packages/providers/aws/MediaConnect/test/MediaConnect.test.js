const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaConnect"] });

describe("MediaConnect", async function () {
  it("Flow", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaConnect::Flow",
        livesNotFound: ({ config }) => [{ FlowArn: "n123" }],
      }),
      awsResourceTest,
    ])());
});
