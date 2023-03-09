const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Detective", async function () {
  it.skip("Graph", () =>
    pipe([
      () => ({
        groupType: "Detective::Graph",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Invitation", () =>
    pipe([
      () => ({
        groupType: "Detective::Invitation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Member", () =>
    pipe([
      () => ({
        groupType: "Detective::Member",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
