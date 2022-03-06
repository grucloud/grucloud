const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudWatchEventBus", async function () {
  let config;
  let provider;
  let eventBus;

  before(async function () {
    provider = AwsProvider({ config });
    eventBus = provider.getClient({ groupType: "CloudWatchEvents::EventBus" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => eventBus.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        eventBus.destroy({
          live: { Name: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        eventBus.getByName({
          name: "124",
        }),
    ])
  );
});
