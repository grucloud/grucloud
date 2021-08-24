const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { EC2LaunchTemplate } = require("../EC2LaunchTemplate");

describe("EC2LaunchTemplate", async function () {
  let config;
  let provider;
  let launchtemplate;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    launchtemplate = EC2LaunchTemplate({ config: provider.config });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => launchtemplate.getList(),
      tap((items) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        launchtemplate.destroy({
          live: { LaunchTemplateId: "lt-12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        launchtemplate.getByName({
          name: "124",
        }),
    ])
  );
});
