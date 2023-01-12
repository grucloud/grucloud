const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSOAdmin", async function () {
  it.skip("AccountAssignment", () =>
    pipe([
      () => ({
        groupType: "SSOAdmin::AccountAssignment",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
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
  it.skip("InstanceAccessControlAttributes", () =>
    pipe([
      () => ({
        groupType: "SSOAdmin::InstanceAccessControlAttributes",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  //

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
