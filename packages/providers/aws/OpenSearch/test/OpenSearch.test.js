const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("OpenSearch", async function () {
  it.skip("Domain", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::Domain",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("DomainPolicy", () =>
    pipe([
      () => ({
        groupType: "OpenSearch::DomainPolicy",
        livesNotFound: ({ config }) => [{}],
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
});
