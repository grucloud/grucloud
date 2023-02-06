const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["Signer"] });

describe("Signer", async function () {
  it.skip("SigningJob", () =>
    pipe([
      () => ({
        config,
        groupType: "Signer::SigningJob",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("SigningProfile", () =>
    pipe([
      () => ({
        config,
        groupType: "Signer::SigningProfile",
        livesNotFound: ({ config }) => [
          { profileName: "pr123", profileVersion: "1", reason: "r" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SigningProfilePermission", () =>
    pipe([
      () => ({
        config,
        groupType: "Signer::SigningProfilePermission",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
