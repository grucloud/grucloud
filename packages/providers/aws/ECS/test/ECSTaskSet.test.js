const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { ECSTaskSet } = require("../ECSTaskSet");

describe.skip("ECSTaskSet", async function () {
  let config;
  let provider;
  let taskset;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    taskset = ECSTaskSet({ config: provider.config });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        taskset.destroy({
          live: { task: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        taskset.getByName({
          name: "124",
        }),
    ])
  );
});
