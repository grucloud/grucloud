const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Inspector2Enabler", async function () {
  let config;
  let provider;
  let enabler;

  before(async function () {
    provider = await AwsProvider({ config });
    enabler = provider.getClient({ groupType: "Inspector2::Enabler" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => enabler.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        enabler.getByName({
          name: "124",
        }),
    ])
  );
});
