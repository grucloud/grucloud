const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Layer", async function () {
  let config;
  let provider;
  let layer;

  before(async function () {
    provider = await AwsProvider({ config });
    layer = provider.getClient({ groupType: "Lambda::Layer" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => layer.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        layer.destroy({
          live: { LayerName: "aa", Version: "1" },
        }),
    ])
  );
  // it(
  //   "getById with invalid id",
  //   pipe([
  //     () =>
  //       layer.getById({
  //         Configuration: { FunctionArn: "a12345" },
  //       }),
  //   ])
  // );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        layer.getByName({
          name: "124",
        }),
    ])
  );
});
