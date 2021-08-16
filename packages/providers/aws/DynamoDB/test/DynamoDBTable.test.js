const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { DynamoDBTable } = require("../DynamoDBTable");

describe("DynamoDBTable", async function () {
  let config;
  let provider;
  let table;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    table = DynamoDBTable({ config: provider.config });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => table.getList(),
      tap((items) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        table.destroy({
          live: { TableName: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        table.getByName({
          name: "124",
        }),
    ])
  );
});
