const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ServiceDiscovery", async function () {
  it("HttpNamespace", () =>
    pipe([
      () => ({
        groupType: "ServiceDiscovery::HttpNamespace",
        livesNotFound: ({ config }) => [{ Id: "i123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Instance", () =>
    pipe([
      () => ({
        groupType: "ServiceDiscovery::Instance",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("PrivateDnsNamespace", () =>
    pipe([
      () => ({
        groupType: "ServiceDiscovery::PrivateDnsNamespace",
        livesNotFound: ({ config }) => [{ Id: "i123" }],
      }),
      awsResourceTest,
    ])());
  it("PublicDnsNamespace", () =>
    pipe([
      () => ({
        groupType: "ServiceDiscovery::PublicDnsNamespace",
        livesNotFound: ({ config }) => [{ Id: "i123" }],
      }),
      awsResourceTest,
    ])());
  it("Service", () =>
    pipe([
      () => ({
        groupType: "ServiceDiscovery::Service",
        livesNotFound: ({ config }) => [{ Id: "i123" }],
      }),
      awsResourceTest,
    ])());
});
