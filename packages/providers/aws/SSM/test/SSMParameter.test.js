const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { SSMParameter } = require("../SSMParameter");

describe("SSMParameter", async function () {
  let config;
  let provider;
  let parameter;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    parameter = SSMParameter({ config: provider.config });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => parameter.getList(),
      tap((items) => {
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
