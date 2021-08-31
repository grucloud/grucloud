const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("EC2LaunchTemplate", async function () {
  let config;
  let provider;
  let launchtemplate;

  before(async function () {
    provider = AwsProvider({ config });
    launchtemplate = provider.getClient({ groupType: "EC2::LaunchTemplate" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => launchtemplate.getList(),
      tap(({ items }) => {
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
