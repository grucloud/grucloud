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

AWS OpsWorks Stacks: This service, which provided a way to deploy and manage applications on AWS resources using Chef, was deprecated in 2022 and is being replaced by AWS OpsWorks for Chef Automate.

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
