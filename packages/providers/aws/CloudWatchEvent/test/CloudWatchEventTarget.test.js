const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudWatchEventTarget", async function () {
  let config;
  let provider;
  let target;

  before(async function () {
    provider = AwsProvider({ config });
    target = provider.getClient({ groupType: "CloudWatchEvents::Target" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        target.destroy({
          live: { Rule: "my-rule", EventBusName: "default", Id: "invalid" },
        }),
    ])
  );
  it.skip(
    "getByName with invalid id",
    pipe([
      () =>
        target.getByName({
          name: "124",
        }),
    ])
  );
});
