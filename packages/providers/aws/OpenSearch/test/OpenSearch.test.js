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
  it.skip("DomainSamlOption", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::DomainSamlOption",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("OutboundConnection", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::OutboundConnection",
        livesNotFound: ({ config }) => [{}],
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
