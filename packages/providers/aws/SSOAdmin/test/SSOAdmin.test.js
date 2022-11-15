const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSOAdmin", async function () {
  it("Instance", () =>
    pipe([
      () => ({
        groupType: "SSOAdmin::Instance",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("PermissionSet", () =>
    pipe([
      () => ({
        groupType: "SSOAdmin::PermissionSet",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
