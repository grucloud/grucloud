const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("DynamoDBTable", async function () {
  let config;
  let provider;
  let table;

  before(async function () {
    provider = await AwsProvider({ config });
    table = provider.getClient({ groupType: "DynamoDB::Table" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => table.getList(),
      tap(({ items }) => {
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
