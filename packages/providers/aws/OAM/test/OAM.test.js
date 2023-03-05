const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("OAM", async function () {
  it.skip("Link", () =>
    pipe([
      () => ({
        groupType: "OAM::Link",
        livesNotFound: ({ config }) => [{ DomainName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Sink", () =>
    pipe([
      () => ({
        groupType: "OAM::Sink",
        livesNotFound: ({ config }) => [{ VpcEndpointId: "aos-12345" }],
      }),
      awsResourceTest,
    ])());
});
