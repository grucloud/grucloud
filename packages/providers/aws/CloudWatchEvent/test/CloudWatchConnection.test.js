const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudWatchEventConnection", async function () {
  let config;
  let provider;
  let connection;

  before(async function () {
    provider = AwsProvider({ config });
    connection = provider.getClient({
      groupType: "CloudWatchEvents::Connection",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => connection.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        connection.destroy({
          live: { Name: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        connection.getByName({
          name: "124",
        }),
    ])
  );
});
