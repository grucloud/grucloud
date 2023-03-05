const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeArtifact", async function () {
  it("Domain", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::Domain",
        livesNotFound: ({ config }) => [
          {
            domain: "d123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DomainPermissionsPolicy", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::DomainPermissionsPolicy",
        livesNotFound: ({ config }) => [
          {
            domain: "d123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Repository", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::Repository",
        livesNotFound: ({ config }) => [
          {
            domain: "d123",
            repository: "d123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RepositoryPermissionsPolicy", () =>
    pipe([
      () => ({
        groupType: "CodeArtifact::RepositoryPermissionsPolicy",
        livesNotFound: ({ config }) => [
          {
            domain: "d123",
            repository: "d123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
