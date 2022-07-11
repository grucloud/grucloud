const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CodeDeployDeploymentGroup", async function () {
  let config;
  let provider;
  let deploymentGroup;

  before(async function () {
    provider = AwsProvider({ config });
    deploymentGroup = provider.getClient({
      groupType: "CodeDeploy::DeploymentGroup",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        deploymentGroup.destroy({
          live: { applicationName: "my-app", deploymentGroupName: "aaaa" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        deploymentGroup.getById({
          applicationName: "my-app",
          deploymentGroupName: "aaaa",
        }),
    ])
  );
});
