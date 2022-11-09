const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MemoryDB ParameterGroup", async function () {
  let config;
  let provider;
  let parameterGroup;

  before(async function () {
    provider = await AwsProvider({ config });
    parameterGroup = provider.getClient({
      groupType: "MemoryDB::ParameterGroup",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => parameterGroup.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        parameterGroup.destroy({
          live: { Name: "parameterGroup-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        parameterGroup.getById({})({
          Name: "parameterGroup-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        parameterGroup.getByName({
          Name: "parameterGroup-1234",
        }),
    ])
  );
});
