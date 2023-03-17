const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");
/**
 * OpsWorksApp
OpsWorksCMBackup
OpsWorksCMServer
OpsWorksCMServerState
OpsWorksInstance
OpsWorksLayer
OpsWorksUserProfile
 */
describe("OpsWork", async function () {
  it.skip("App", () =>
    pipe([
      () => ({
        groupType: "OpsWork::App",
        livesNotFound: ({ config }) => [
          {
            Name: "env",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
