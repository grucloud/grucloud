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
  it("Server", () =>
    pipe([
      () => ({
        groupType: "Transfer::Server",
        livesNotFound: ({ config }) => [{ ServerId: "s-dc21f45ec5764e801" }],
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
  it("User", () =>
    pipe([
      () => ({
        groupType: "Transfer::User",
        livesNotFound: ({ config }) => [
          { ServerId: "s-dc21f45ec5764e801", UserName: "123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Workflow", () =>
    pipe([
      () => ({
        groupType: "Transfer::Workflow",
        livesNotFound: ({ config }) => [{ WorkflowId: "w-01234567891234567" }],
      }),
      awsResourceTest,
    ])());
});
