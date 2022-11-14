const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("IdentityStore", async function () {
  it.skip("User", () =>
    pipe([
      () => ({
        groupType: "IdentityStore::User",
        livesNotFound: ({ config }) => [
          { IdentityStoreId: "i1234", UserName: "u123" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Group", () =>
    pipe([
      () => ({
        groupType: "IdentityStore::Group",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("GroupMembership", () =>
    pipe([
      () => ({
        groupType: "IdentityStore::GroupMembership",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
});
