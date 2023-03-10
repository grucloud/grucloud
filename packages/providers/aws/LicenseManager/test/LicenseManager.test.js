const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("LicenseManager", async function () {
  it.skip("Association", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::Association",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Grant", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::Grant",
        livesNotFound: ({ config }) => [{ GrantArn: "" }],
      }),
      awsResourceTest,
    ])());
  it.skip("GrantAccepter", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::GrantAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("LicenseConfiguration", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::LicenseConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
