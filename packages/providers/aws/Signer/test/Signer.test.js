const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["Signer"] });

describe("Signer", async function () {
  it("SigningJob", () =>
    pipe([
      () => ({
        config,
        groupType: "Signer::SigningJob",
        livesNotFound: ({ config }) => [
          { jobId: "6593e837-c99d-4b4e-a743-68f45fa54e9f" },
        ],
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
  it("SigningProfilePermission", () =>
    pipe([
      () => ({
        config,
        groupType: "Signer::SigningProfilePermission",
        livesNotFound: ({ config }) => [
          { profileName: "p1234", revisionId: "v1", statementId: "stmt" },
        ],
      }),
      awsResourceTest,
    ])());
});
