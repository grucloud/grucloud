const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("AutoScalingLaunchConfiguration", async function () {
  let config;
  let provider;
  let launchconfiguration;

  before(async function () {
    provider = AwsProvider({ config });
    launchconfiguration = provider.getClient({
      groupType: "AutoScaling::LaunchConfiguration",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => launchconfiguration.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        launchconfiguration.destroy({
          live: { LaunchConfigurationName: "lc-12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        launchconfiguration.getByName({
          name: "124",
        }),
    ])
  );
});
