const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeArtifact", async function () {
  it.skip("Domain", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::Domain",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("DomainPermissionsPolicy", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::DomainPermissionsPolicy",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Repository", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::Repository",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("RepositoryPermissionsPolicy", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::RepositoryPermissionsPolicy",
        livesNotFound: ({ config }) => [
          {
            name: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
