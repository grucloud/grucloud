const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ECR", async function () {
  it("Registry", () =>
    pipe([
      () => ({
        groupType: "ECR::Registry",
        livesNotFound: ({ config }) => [{}],
        //TODO
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("Repository", () =>
    pipe([
      () => ({
        groupType: "ECR::Repository",
        livesNotFound: ({ config }) => [{ repositoryName: "12345" }],
      }),
      awsResourceTest,
    ])());
});
