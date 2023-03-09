const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Pinpoint", async function () {
  it.skip("DataSource", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::App",
        livesNotFound: ({ config }) => [{}],
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
