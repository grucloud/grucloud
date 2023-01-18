const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Signer", async function () {
  it.skip("SigningJob", () =>
    pipe([
      () => ({
        groupType: "Signer::SigningJob",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SigningProfile", () =>
    pipe([
      () => ({
        groupType: "Signer::SigningProfile",
        livesNotFound: ({ config }) => [
          { profileName: "p", profileVersion: "1", reason: "r" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SigningProfilePermission", () =>
    pipe([
      () => ({
        groupType: "Signer::SigningProfilePermission",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
