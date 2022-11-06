const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ApplicationAutoScalingPolicy", async function () {
  let config;
  let provider;
  let policy;

  before(async function () {
    provider = await AwsProvider({ config });
    policy = provider.getClient({
      groupType: "ApplicationAutoScaling::Policy",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => policy.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
});
