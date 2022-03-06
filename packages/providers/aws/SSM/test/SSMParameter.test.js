const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("SSMParameter", async function () {
  let config;
  let provider;
  let parameter;

  before(async function () {
    provider = AwsProvider({ config });
    parameter = provider.getClient({ groupType: "SSM::Parameter" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => parameter.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        parameter.destroy({
          live: { Name: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        parameter.getByName({
          name: "124",
        }),
    ])
  );
});
