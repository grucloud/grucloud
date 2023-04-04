const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Pinpoint", async function () {
  it("App", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::App",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it.skip("EmailChannel", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::EmailChannel",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
