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
  it.skip("LicenseConfiguration", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::LicenseConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
