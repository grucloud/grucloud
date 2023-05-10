const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("OpenSearch", async function () {
  it("Domain", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::Domain",
        livesNotFound: ({ config }) => [{ DomainName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("InboundConnectionAccepter", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::InboundConnectionAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("OutboundConnection", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::OutboundConnection",
        livesNotFound: ({ config }) => [{ ConnectionId: "c1234567890" }],
      }),
      awsResourceTest,
    ])());
  it("VpcEndpoint", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::VpcEndpoint",
        livesNotFound: ({ config }) => [{ VpcEndpointId: "aos-12345" }],
      }),
      awsResourceTest,
    ])());
});
