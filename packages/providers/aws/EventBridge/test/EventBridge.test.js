const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EventBridge", async function () {
  it("Endpoint", () =>
    pipe([
      () => ({
        groupType: "EventBridge::Endpoint",
        livesNotFound: ({ config }) => [{ Name: "e123" }],
      }),
      awsResourceTest,
    ])());
});
