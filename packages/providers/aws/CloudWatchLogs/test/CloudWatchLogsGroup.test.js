const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("CloudWatchLogsGroup", async function () {
  let config;
  let provider;
  let logGroup;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    logGroup = provider.getClient({ groupType: "CloudWatchLogs::LogGroup" });
    await provider.start();
  });
  it("list", pipe([() => logGroup.getList()]));
  it(
    "delete with invalid id",
    pipe([
      () =>
        logGroup.destroy({
          live: { logGroupName: "lg-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        logGroup.getById({
          logGroupName: "lg-124",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        logGroup.getByName({
          name: "124",
        }),
    ])
  );
});
