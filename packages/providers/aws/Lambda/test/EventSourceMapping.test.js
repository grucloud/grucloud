const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe.skip("LambdaEventSourceMapping", async function () {
  let config;
  let provider;
  let eventSourceMapping;

  before(async function () {
    provider = AwsProvider({ config });
    eventSourceMapping = provider.getClient({
      groupType: "Lambda::EventSourceMapping",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => eventSourceMapping.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        eventSourceMapping.getById({
          UUID: "12345",
        }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        eventSourceMapping.destroy({
          live: { UUID: "12345" },
        }),
    ])
  );
  it.skip(
    "getByName with invalid id",
    pipe([
      () =>
        eventSourceMapping.getByName({
          name: "124",
        }),
    ])
  );
});
