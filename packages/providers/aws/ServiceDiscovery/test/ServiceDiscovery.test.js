const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ServiceDiscovery", async function () {
  it.skip("Service", () =>
    pipe([
      () => ({
        groupType: "ServiceDiscovery::Service",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
