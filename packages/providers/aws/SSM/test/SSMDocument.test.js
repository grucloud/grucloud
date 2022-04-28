const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe.only("SSMDocument", async function () {
  let config;
  let provider;
  let document;

  before(async function () {
    provider = AwsProvider({ config });
    document = provider.getClient({ groupType: "SSM::Document" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => document.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        document.destroy({
          live: { Name: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        document.getById({
          Name: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        document.getByName({
          name: "124",
        }),
    ])
  );
});
