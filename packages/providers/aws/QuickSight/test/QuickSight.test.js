const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("QuickSight", async function () {
  it.skip("DataSource", () =>
    pipe([
      () => ({
        groupType: "QuickSight::DataSource",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Group", () =>
    pipe([
      () => ({
        groupType: "QuickSight::View",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("GroupMembership", () =>
    pipe([
      () => ({
        groupType: "QuickSight::GroupMembership",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("User", () =>
    pipe([
      () => ({
        groupType: "QuickSight::User",
        livesNotFound: ({ config }) => [{ Group: "e123" }],
      }),
      awsResourceTest,
    ])());
});
