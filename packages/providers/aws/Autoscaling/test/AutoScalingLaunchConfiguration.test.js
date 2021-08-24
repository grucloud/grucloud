const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const {
  AutoScalingLaunchConfiguration,
} = require("../AutoScalingLaunchConfiguration");

describe("AutoScalingLaunchConfiguration", async function () {
  let config;
  let provider;
  let launchconfiguration;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    launchconfiguration = AutoScalingLaunchConfiguration({
      config: provider.config,
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => launchconfiguration.getList(),
      tap((items) => {
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
