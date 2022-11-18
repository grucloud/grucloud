const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("IdentityStore", async function () {
  it("User", () =>
    pipe([
      () => ({
        groupType: "IdentityStore::User",
        livesNotFound: ({ config }) => [
          {
            IdentityStoreId: "d-9067ba8993",
            UserId: "54c8e428-10c1-70ac-8e9a-f19de0ce9d7a",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Group", () =>
    pipe([
      () => ({
        groupType: "IdentityStore::Group",
        livesNotFound: ({ config }) => [
          {
            IdentityStoreId: "d-9067ba8993",
            GroupId: "54c8e428-10c1-70ac-8e9a-f19de0ce9d7b",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GroupMembership", () =>
    pipe([
      () => ({
        groupType: "IdentityStore::GroupMembership",
        livesNotFound: ({ config }) => [
          {
            IdentityStoreId: "d-9067ba8993",
            MembershipId: "54c8e428-10c1-70ac-8e9a-f19de0ce9d7c",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
