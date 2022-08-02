const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Function", async function () {
  let config;
  let provider;
  let fun;

  before(async function () {
    provider = await AwsProvider({ config });
    fun = provider.getClient({ groupType: "Lambda::Function" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => fun.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        fun.destroy({
          live: { Configuration: { FunctionArn: "a12345" } },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        fun.getById({
          Configuration: { FunctionArn: "a12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        fun.getByName({
          name: "124",
        }),
    ])
  );
});
