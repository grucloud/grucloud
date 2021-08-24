const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { ECSCapacityProvider } = require("../ECSCapacityProvider");

describe("ECSCapacityProvider", async function () {
  let config;
  let provider;
  let capacityprovider;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    capacityprovider = ECSCapacityProvider({ config: provider.config });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => capacityprovider.getList(),
      tap((items) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  // it(
  //   "delete with invalid id",
  //   pipe([
  //     () =>
  //       capacityprovider.destroy({
  //         live: { name: "12345" },
  //       }),
  //   ])
  // );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        capacityprovider.getByName({
          name: "124",
        }),
    ])
  );
});
