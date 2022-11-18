const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Transfer", async function () {
  it.skip("Access", () =>
    pipe([
      () => ({
        groupType: "Transfer::Access",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Server", () =>
    pipe([
      () => ({
        groupType: "Transfer::Server",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SshKey", () =>
    pipe([
      () => ({
        groupType: "Transfer::SshKey",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Tag", () =>
    pipe([
      () => ({
        groupType: "Transfer::Tag",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("User", () =>
    pipe([
      () => ({
        groupType: "Transfer::User",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Workflow", () =>
    pipe([
      () => ({
        groupType: "Transfer::Workflow",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
